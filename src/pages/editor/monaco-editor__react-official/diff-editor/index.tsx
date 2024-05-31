
import {DiffEditor as MonacoDiffEditor} from '@monaco-editor/react';
import {observer} from 'mobx-react';
import {store} from '../store';
import {diffEditorExamples} from '../config/diff-editor';
import style from './style.module.scss';

export const DiffEditor = observer(() => {
  const {
    monacoTheme,
    diffEditor: {
      language,
    },
  } = store;

  return (
    <div className={style.diffEditor}>
      <MonacoDiffEditor
        height="100vh"
        theme={monacoTheme}
        original={diffEditorExamples.original}
        modified={diffEditorExamples.modified}
        language={language}
      />
    </div>
  );
});
