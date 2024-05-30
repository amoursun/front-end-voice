import {useState, useRef, useMemo, useCallback, useEffect} from 'react'
import {Button, Input, Select} from 'antd';
import * as monaco from 'monaco-editor';
import type {languages} from 'monaco-editor/esm/vs/editor/editor.api.d';
import {language as jsLanguage} from 'monaco-editor/esm/vs/basic-languages/javascript/javascript';
import MonacoEditor from '@monaco-editor/react';
import style from './style.module.scss';
import {EDITOR_LANGUAGES} from '../language';

const transferSuggestions = (items: string[]) => {
  return [...items, 'and', 'or', '(', ')'].map((item) => {
    return {
      label: item, // 显示的label
      detail: !items.includes(item) ? '符号' : '字段', // 描述
      insertText: item, // 选择后插入的value
      icon: items.includes(item),
    };
  });
};
export const MonacoEditorReact = () => {
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor>(); // 编辑器实例
  const [language, setLanguage] = useState('plaintext'); // 当前语言
  
  const editorDidMount = (editor: monaco.editor.IStandaloneCodeEditor, instance: typeof monaco) => {
    console.log('editorDidMount', editor, instance);
    // editorRef.current = editor;
    // monacoRef.current = instance;
    const transferList = transferSuggestions(['代码提示']);
    if(transferList.length){
      editorRef.current = monaco.languages.registerCompletionItemProvider(
        language,
        {
          provideCompletionItems(model, position, ...args) {
            const suggestions: Array<languages.CompletionItem> = []
            const {lineNumber, column} = position
            const textBeforePointer = model.getValueInRange({
              startLineNumber: lineNumber,
              startColumn: 0,
              endLineNumber: lineNumber,
              endColumn: column,
            });
            const word = model.getWordUntilPosition(position);
            const range = {
              startLineNumber: lineNumber,
              endLineNumber: lineNumber,
              startColumn: word.startColumn,
              endColumn: word.endColumn
            };
            const contents = textBeforePointer.trim().split(/\s+/)
            const lastContents = contents[contents?.length - 1] // 获取最后一段非空字符串
            if (lastContents) {
              const configKey = ['keywords', 'operators']
              configKey.forEach(key => {
                jsLanguage[key].forEach((k: string) => {
                  suggestions.push(
                    {
                      label: k, // 显示的提示内容;默认情况下，这也是选择完成时插入的文本。
                      insertText: k, // 选择此完成时应插入到文档中的字符串或片段
                      detail: '关键字', // 描述
                      preselect: true, // 设置为true，表示预先选择此完成项
                      documentation: '关键字', // 鼠标悬停时显示的文本
                      kind: monaco.languages.CompletionItemKind['Function'], // 此完成项的种类。编辑器根据图标的种类选择图标。
                      range,
                    } as languages.CompletionItem
                  )
                });
              })
            }
            // const suggestions = transferList.map((item) => ({
            //   ...item,
            //   kind: item.icon
            //     ? monaco.languages.CompletionItemKind.Variable // 图标
            //     : monaco.languages.CompletionItemKind.Text,
            // })) as unknown as Array<languages.CompletionItem>;
            return {
              suggestions,
              // incomplete: true, // 设置为true，表示不完整，会继续请求provideCompletionItems
            };
          },
          triggerCharacters: [' '], // 触发代码提示的关键字，ps：可以有多个
        },
      );
    }
  };
  return (
    <div className={style.monacoEditor}>
      <Select
        className={style.languageSelect}
        value={language}
        options={EDITOR_LANGUAGES}
        onChange={setLanguage}
      />
      <MonacoEditor
        width="800px"
        height="600px"
        // light
        theme="vs-dark"
        language={language}
        onMount={editorDidMount}
      />
    </div>
  );
};

export default MonacoEditorReact;
