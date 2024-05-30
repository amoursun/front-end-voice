import * as monaco from 'monaco-editor';

export const EDITOR_LANGUAGES =  monaco.languages.getLanguages().map(it => ({...it, value: it.id, label: it.id}));