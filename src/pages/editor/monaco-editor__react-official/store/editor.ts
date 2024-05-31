import {makeAutoObservable, computed} from 'mobx';
import * as monaco from 'monaco-editor';
import {IEditorEnum, IThemeEnum, IThemeType} from './type';
import {config} from '../config';

const {
    supportedLanguages,
} = config;
export class EditorState {
    options: monaco.editor.IEditorOptions = {
        acceptSuggestionOnCommitCharacter: true,
        acceptSuggestionOnEnter: 'on',
        accessibilitySupport: 'auto',
        autoIndent: 'keep',
        automaticLayout: true,
        codeLens: true,
        colorDecorators: true,
        contextmenu: true,
        cursorBlinking: 'blink',
        cursorSmoothCaretAnimation: 'on',
        cursorStyle: 'line',
        disableLayerHinting: false,
        disableMonospaceOptimizations: false,
        dragAndDrop: false,
        fixedOverflowWidgets: false,
        folding: true,
        foldingStrategy: 'auto',
        fontLigatures: false,
        formatOnPaste: false,
        formatOnType: false,
        hideCursorInOverviewRuler: false,
        links: true,
        mouseWheelZoom: false,
        multiCursorMergeOverlapping: true,
        multiCursorModifier: 'alt',
        overviewRulerBorder: true,
        overviewRulerLanes: 2,
        quickSuggestions: true,
        quickSuggestionsDelay: 100,
        readOnly: false,
        renderControlCharacters: false,
        renderFinalNewline: 'on',
        renderLineHighlight: 'all',
        renderWhitespace: 'none',
        revealHorizontalRightPadding: 30,
        roundedSelection: true,
        rulers: [],
        scrollBeyondLastColumn: 5,
        scrollBeyondLastLine: true,
        selectOnLineNumbers: true,
        selectionClipboard: true,
        selectionHighlight: true,
        showFoldingControls: 'mouseover',
        smoothScrolling: false,
        suggestOnTriggerCharacters: true,
        // eslint-disable-next-line
        wordSeparators: `~!@#$%^&*()-=+[{]}\|;:'",.<>/?`,
        wordWrap: 'off',
        wordWrapBreakAfterCharacters: '\t})]?|&,;',
        wordWrapBreakBeforeCharacters: '{([+',
        wordWrapColumn: 80,
        wrappingIndent: 'none',
    };
    monacoTheme: IThemeType = IThemeEnum.VS_DARK;
    selectedLanguageId: number = 19;
    
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
    setMonacoTheme = (theme: IThemeType) => {
        this.monacoTheme = theme;
    };
}

