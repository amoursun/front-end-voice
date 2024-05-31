import React from 'react';
import {observer} from 'mobx-react';
import MonacoEditor from '@monaco-editor/react';
import * as MonacoInstance from 'monaco-editor';
import {Setting} from './setting';
import {store} from '../store';
import {editorExamples} from '../config/editor';
import style from './style.module.scss';

export const Editor = observer(() => {
  const {editor: {selectedLanguageId, options, language}, monacoTheme} = store;

  const handleEditorWillMount = (monaco: typeof MonacoInstance) => {
    monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
      target: monaco.languages.typescript.ScriptTarget.Latest,
      module: monaco.languages.typescript.ModuleKind.ES2015,
      allowNonTsExtensions: true,
      lib: ['es2018'],
    });
  };

  return (
    <div className={style.editorContainer}>
      <div className={style.editor}>
        <MonacoEditor
          theme={monacoTheme}
          height="100vh"
          path={language}
          defaultValue={editorExamples[selectedLanguageId] || ''}
          defaultLanguage={language}
          options={options}
          beforeMount={handleEditorWillMount}
        />
      </div>
      <Setting className={style.setting} />
  </div>
  );
});
