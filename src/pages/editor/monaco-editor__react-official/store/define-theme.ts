import {loader} from '@monaco-editor/react';
import { IMonacoTheme } from './type';

const themesPath = '@/node_modules/monaco-themes/themes/';
// 不能使用变量
const themeFiles = import.meta.glob('@/node_modules/monaco-themes/themes/*.json', {eager: true});
const monacoThemes: Record<string, string> = {};
Object.keys(themeFiles).forEach((key) => {
  const theme = key.replace(themesPath.slice(1), '').replace('.json', '');
  const themeKey = theme.toLocaleLowerCase().replace(/\s+/, '_');
  monacoThemes[themeKey] = theme;
})
// monacoThemes = {'active4d':'Active4D','all-hallows-eve':'All Hallows Eve',...}
export {monacoThemes}
export const defineTheme = (theme: IMonacoTheme) => {
  return new Promise(resolve => {
    Promise.all(
      [
        loader.init(),
        // 不能使用变量
        import(`@/node_modules/monaco-themes/themes/${monacoThemes[theme]}.json`),
      ]
    ).then((res) => {
      const [monaco, themeData] = res;
      // console.log(res, 'themeData')
      monaco.editor.defineTheme(theme, themeData);
      resolve([monaco, themeData]);
    });
  });
};
