import {useState, useRef, useEffect, useCallback} from 'react'
import {Button, Input, Select} from 'antd';
import MonacoEditor from 'react-monaco-editor';
import style from './style.module.scss';
import {EDITOR_LANGUAGES} from '../language';
import {MonacoVariableTips, monaco, variableData} from './monaco-variable-tips';
import {isEmpty} from 'lodash-es';

export const ReactMonacoEditor = () => {
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript');
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor>(); // 编辑器实例
  const monacoRef = useRef<typeof monaco>(); // monaco 实例
  const monacoHoverProviderRef = useRef<monaco.IDisposable>(); // monaco 鼠标悬浮提示注册缓存
  const monacoProviderRef = useRef<monaco.IDisposable>(); // monaco  变量提示注册缓存
  useEffect(() => {
    if (!isEmpty(variableData)) {
      const monacoVariableTips = new MonacoVariableTips({variableData, level: 2});
      // 为编辑器注入变量提示
      monacoProviderRef.current = monacoRef.current?.languages.registerCompletionItemProvider(language, {
          provideCompletionItems: (model, position) => {
            monacoVariableTips.parseContinuousContent(model, position);
            return {
              suggestions: monacoVariableTips.getSuggestions() as any,
              // suggestions: variableData.map(item => ({
              //   ...item,
              //   kind: monaco.languages.CompletionItemKind.Variable,
              // })) as any,
            };
          },
          triggerCharacters: ['.'],
          // triggerCharacters: [':', 't', 'c', 's'],
        }
      );
      // 鼠标悬浮提示
      monacoHoverProviderRef.current = monaco.languages.registerHoverProvider(language, {
        provideHover: (model, position) => {
          monacoVariableTips.parseContinuousContent(model, position);
          return {
            contents: monacoVariableTips.getHover(),
          };
        },
      });
    }
    return () => {
      // 退出时,销毁注册的内容避免重复创建
      monacoProviderRef.current?.dispose();
      monacoHoverProviderRef.current?.dispose();
    };
  }, [language, variableData])

  const options: monaco.editor.IStandaloneEditorConstructionOptions = {
    selectOnLineNumbers: true,
    roundedSelection: false,
    // "line" | "block" | "underline" | "line-thin" | "block-outline" | "underline-thin" | undefined
    cursorStyle: 'line',
    wordWrap: 'on',
    glyphMargin: true,
    renderLineHighlight: 'all',
  };
  const onChange = (newValue: string, e: monaco.editor.IModelContentChangedEvent)=> {
    // console.log('onChange', newValue, e);
    setCode(newValue);
  };
  const editorDidMount = useCallback((editor: monaco.editor.IStandaloneCodeEditor, instance: typeof monaco) => {
    console.log('editorDidMount', editor, instance);
    editorRef.current = editor;
    monacoRef.current = instance;
    editor.focus();
    editor.trigger('keyboard', 'type', {text: '待插入的内容'});
  }, []);
  return (
    <div className={style.monacoEditor}>
      <Select
        className={style.languageSelect}
        value={language}
        options={EDITOR_LANGUAGES}
        onChange={setLanguage}
      />
      <MonacoEditor
        width="800"
        height="600"
        language={language}
        // hc-black vs-dark vs
        theme="vs-dark"
        value={code}
        onChange={onChange}
        options={options}
        editorDidMount={editorDidMount}
      />
    </div>
  );
};

export default ReactMonacoEditor;


 