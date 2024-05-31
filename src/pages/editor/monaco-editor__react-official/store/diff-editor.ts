import {computed, makeAutoObservable} from 'mobx';
import * as monaco from 'monaco-editor';
import {IThemeType, IThemeEnum} from './type';
import {config} from '../config';

const {
    supportedLanguages,
} = config;
export class DiffEditorState {
    options: monaco.editor.IEditorOptions = {};
    monacoTheme: IThemeType = IThemeEnum.VS_DARK;
    selectedLanguageId: number = 24; // 24 is the id of markdown
    
    constructor() {
        makeAutoObservable(this, {
            language: computed,
        });
    }

    get language() {
        return supportedLanguages.find(({id}) => id === this.selectedLanguageId)?.name;
    }
    
    setSelectedLanguageId = (id: number) => {
        this.selectedLanguageId = id;
    };
    
    setOptions = (options: monaco.editor.IEditorOptions) => {
        this.options = options;
    };
}

