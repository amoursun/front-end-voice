import {makeAutoObservable, computed, runInAction} from 'mobx';
import {IEditorEnum, IThemeEnum, IThemeType} from './type';
import {EditorState} from './editor';
import { DiffEditorState } from './diff-editor';
import {ReactionManager} from '../../../../utils/mobx/reaction-manager';
class State {
  reactions = new ReactionManager();
  constructor() {
    makeAutoObservable(this);
  }
  isEditorReady = false;
  monacoTheme: IThemeType = IThemeEnum.VS_DARK;
  editorMode: IEditorEnum = IEditorEnum.editor;
  setIsEditorReady = (isReady: boolean) => {
    this.isEditorReady = isReady;
  };
  setEditorMode = (editorMode: IEditorEnum) => {
    this.editorMode = editorMode;
  };
  editor = new EditorState();
  diffEditor = new DiffEditorState();
}

export const store = new State();
