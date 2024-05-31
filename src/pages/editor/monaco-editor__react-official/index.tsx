import {useContext, useState, useRef, useMemo, useCallback, useEffect} from 'react'
import {Button, Input, Select} from 'antd';
import cx from 'classnames';
import {observer} from 'mobx-react';
import {store} from './store';
import {IEditorEnum} from './store/type';
import {Header} from './header';
import {Editor} from './editor';
import {DiffEditor} from './diff-editor';
import style from './style.module.scss';

export const MonacoEditorReactOfficial = observer(() => {
  const {editorMode} = store;
  return (
    <div className={cx(style.monacoEditorOfficial)}>
      <Header />
      {editorMode === IEditorEnum.editor
        ? <Editor />
        : <DiffEditor />}
    </div>
  );
});

export default MonacoEditorReactOfficial;
