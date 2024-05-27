/**
 * TypeError: monacoEditorPlugin is not a function
 * https://github.com/vdesjs/vite-plugin-monaco-editor/issues/21
 */
import monacoEditorPluginModule from 'vite-plugin-monaco-editor';

const isObjectWithDefaultFunction = (
    module: unknown
): module is {default: typeof monacoEditorPluginModule} => (
    module != null &&
    typeof module === 'object' &&
    'default' in module &&
    typeof module.default === 'function'
);

export const monacoEditorPlugin = isObjectWithDefaultFunction(monacoEditorPluginModule)
    ? monacoEditorPluginModule.default
    : monacoEditorPluginModule;
