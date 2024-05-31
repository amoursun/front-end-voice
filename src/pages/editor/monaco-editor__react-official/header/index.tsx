import React from 'react';
import cx from 'classnames';
import {observer} from 'mobx-react';
import {Button, Switch} from 'antd';
import {store} from '../store';
import {IEditorEnum} from '../store/type';
import style from './style.module.scss';

export const Header = observer(() => {
  const {
    editorMode,
    setEditorMode,
  } = store;

  const handleSwitch = (checked: boolean) => {
    setEditorMode(checked ? IEditorEnum.editor : IEditorEnum.diffEditor);
  };

  return (
    <div className={style.header}>
      <span className={style.mode}>切换模式: </span>
      <Switch checkedChildren="editor" unCheckedChildren="diff-editor" onChange={handleSwitch} checked={editorMode === IEditorEnum.editor} />
    </div>
  );
});
