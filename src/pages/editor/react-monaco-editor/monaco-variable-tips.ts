import {isArray} from 'lodash-es';
import * as monaco from 'monaco-editor';

type FormatFunctionProps = {
  match: string;
  word: string;
  parentWord: string,
  remark?: string;
  children?: FormatFunctionProps[];
};
interface MonacoVariableTipsProps {
  variableData: FormatFunctionProps[];
  level: number;
}

interface TipProps {
  word: string;
  remark?: string;
}

export {monaco};

export class MonacoVariableTips {
  // 当前行输入的连续内容
  content: string | undefined;

  // 当前行输入的内容
  lineContent: string | undefined;

  // 刚输入的内容
  input: string | undefined;

  // 当前行输入的单词
  word: string | undefined;

  private model: monaco.editor.ITextModel | undefined;

  private position: monaco.Position | undefined;

  // 要提示的层级， 默认提示下一层
  private readonly level: number;

  // 完整的变量数据
  private readonly variableData: FormatFunctionProps[];

  /**
   * 为 monaco 编辑器添加变量提示
   * @param props
   */
  constructor(props: MonacoVariableTipsProps) {
    this.level = props.level || 1;
    this.variableData = props.variableData;
  }

  /**
   * 是否由 . 触发
   */
  get isDotTrigger() {
    return this.input === '.';
  }

  /**
   * 解析当前行
   */
  parseContinuousContent(model: monaco.editor.ITextModel, position: monaco.Position) {
    if (!position || !model) {
      throw new Error('position | model is undefined');
    }
    this.model = model;
    this.position = position;
    const { column, lineNumber } = this.position;
    this.lineContent = this.model.getLineContent(lineNumber);
    this.content =
      this.lineContent
        .slice(0, column - 1)
        .split(' ')
        .pop() || '';
    this.input = this.lineContent[column - 2];
    this.word = this.model.getWordAtPosition(position)?.word;
  }

  /**
   * 解析内容为变量层级
   * @param str
   * @param isFlat 是否打平为一维字符串数组
   */
  static analysisWords(str: string = '', isFlat?: boolean) {
    // 把 ... 替换成 ***
    const _str = str.replace(/\.\.\./g, '***');
    const res = _str
      .split('.')
      .filter(Boolean)
      .map((v) => {
        return {
          word: v.replace(/\*\*\*/g, '...'),
          match: v.match(/^\w*/g)?.join('')!,
        };
      });
    if (isFlat) {
      return res.map((v) => v.match);
    }
    return res;
  }

  /**
   * 根据输入在变量匹配 tree 中搜索命中的层级
   * @param inputWords
   */
  searchFunctionsVariable(inputWords: string[]) {
    let res: FormatFunctionProps[] = [];
    let target: FormatFunctionProps | undefined;
    inputWords.forEach((word, index) => {
      if (!target) {
        target = this.variableData.find((v) => v.match.startsWith(word));
        if (target && inputWords.length === index + 1) {
          // 最后一层
          res = [target];
        }
      }
      else if (inputWords.length === index + 1) {
        // 表示已经到目标最后一层，进行模糊搜索
        const r = target.children?.filter((v) => v.match.startsWith(word)) || [];
        res = r;
      } else {
        target = target.children?.find((v) => v.match.startsWith(word));
      }
    });

    return res;
  }

  /**
   * 深搜结果，拉平成一维数组
   * @param searchResult
   * @param isDotTrigger
   * @param inputLength
   */
  dfsSearchResult(searchResult: FormatFunctionProps[], isDotTrigger: boolean, inputLength: number) {
    const tips: TipProps[] = [];
    const { level } = this;

    const clearStartDot = (word: string = '') => {
      if (word.startsWith('.')) {
        return word.substring(1);
      }
      return word;
    };
    dfs(searchResult, {word: ''}, 0, {} as FormatFunctionProps);

    function dfs(
      curSearchResult: FormatFunctionProps[],
      curTip: {word: string; remark?: string},
      curLevel: number,
      parentSearchResult: FormatFunctionProps,
    ) {
      // 边界
      if (!curSearchResult || curSearchResult.length === 0 || curLevel > level) {
        if (isDotTrigger) {
          if (curLevel === level) {
            // eslint-disable-next-line no-param-reassign
            curTip.word = curTip.word.substring(parentSearchResult.parentWord.length + 1);
          } else if (curLevel > level) {
            // eslint-disable-next-line no-param-reassign
            curTip.word = curTip.word.substring(inputLength + 1);
          }
        }
        // eslint-disable-next-line no-param-reassign
        curTip.word = clearStartDot(curTip.word);
        if (curTip.word) {
          tips.push(curTip);
        }
        return;
      }

      // 添加父级数据
      if (curLevel > 0) {
        const _tip = { ...curTip };
        if (!isDotTrigger) {
          _tip.word = clearStartDot(_tip.word);
          if (_tip.word) {
            tips.push(_tip);
          }
        }
      }

      // 如果还没到层级继续往下走
      curSearchResult.forEach((item) => {
        dfs(
          item.children || [],
          {
            ...curTip,
            word: `${curTip.word}.${item.word}`,
            remark: item.remark || curTip.remark,
          },
          curLevel + 1,
          item,
        );
      });
    }

    return tips;
  }

  /**
   * 生成提示
   * @param tips
   */
  generateSuggestions(tips: TipProps[]) {
    return tips.map((item) => ({
      label: item.word,
      kind: monaco.languages.CompletionItemKind.Function,
      insertText: item.word,
      documentation: item.remark,
      detail: item.remark,
      // range: {
      //   startLineNumber: 1,
      // },
    }));
  }

  /**
   * 生成悬浮提示数据格式
   * @param hoverTips
   */
  generateHover(hoverTips: FormatFunctionProps[]) {
    return hoverTips.map((item) => ({
      value: item.remark || '',
      isTrusted: true,
      supportThemeIcons: true,
    }));
  }

  getSuggestions() {
    const words = MonacoVariableTips.analysisWords(this.content, true) as string[];
    const searchResult = this.searchFunctionsVariable(words);
    const inputLength = words.join('').length;
    const tips = this.dfsSearchResult(searchResult, this.isDotTrigger, inputLength);
    const suggestions = this.generateSuggestions(tips);
    return suggestions;
  }

  getHover() {
    const words = MonacoVariableTips.analysisWords(this.content, true) as string[];
    if (isArray(words) && words.length > 0) {
      words[words.length - 1] = this.word!;
    }
    const hoverTips = this.searchFunctionsVariable(words);
    const hovers = this.generateHover(hoverTips);
    return hovers;
  }
}

export const variableData = [
  {
    match: 'con',
    word: 'con',
    remark: '提示的文字',
    parentWord: '',
    children: [
      {
        match: 'const',
        word: 'const',
        remark: '提示的文字',
        parentWord: 'con',
      },
    ],
  },
];