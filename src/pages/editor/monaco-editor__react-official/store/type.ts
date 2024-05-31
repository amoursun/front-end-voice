import {monacoThemes} from './define-theme';

export enum IThemeEnum {
    'LIGHT' = 'light',
    'VS_DARK' = 'vs-dark',
}
export type IMonacoTheme =  keyof typeof monacoThemes;

export type IThemeType = IThemeEnum | IMonacoTheme;

export enum IEditorEnum {
    'editor' = 'editor',
    'diffEditor' = 'diffEditor',
}