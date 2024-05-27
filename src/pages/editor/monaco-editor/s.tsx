/**
 * https://github.com/microsoft/monaco-editor/blob/main/docs/integrate-esm.md#using-vite
 * https://github.com/vitejs/vite/discussions/1791
 */
import * as monaco from 'monaco-editor';
import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker';
import jsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker';
import cssWorker from 'monaco-editor/esm/vs/language/css/css.worker?worker';
import htmlWorker from 'monaco-editor/esm/vs/language/html/html.worker?worker';
import tsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker';

export class Monaco extends HTMLElement {
    private editor: monaco.editor.IStandaloneCodeEditor
    private sizeObserver: ResizeObserver = new ResizeObserver(() => {
        this.editor.layout();
    })
    constructor() {
        super()
        self.MonacoEnvironment = {
            getWorker(_, label) {
                if (label === 'json') {
                    return new jsonWorker();
                }
                if (label === 'css' || label === 'scss' || label === 'less') {
                    return new cssWorker();
                }
                if (label === 'html' || label === 'handlebars' || label === 'razor') {
                    return new htmlWorker();
                }
                if (label === 'typescript' || label === 'javascript') {
                    return new tsWorker();
                }
                return new editorWorker()
            }
        };
        this.editor = monaco.editor.create(this, {
            value: [
                'function x() {',
                '\\tconsole.log("Hello world!");',
                '}'
            ].join('\\n'),
            language: 'typescript'
        });
        this.editor.onDidChangeModelContent(() => {
            if (this.editor) {
                const value = this.editor.getValue(); // 给父组件实时返回最新文本
                this.emit('change', value);
            }
        })
        // 设置深色主题 需要在编辑器创建完毕以后使用
        monaco.editor.setTheme('vs-dark');
        /**
         * 在此类被创建的时候,可能还没有被添加到DOM树中
         * 因此不会存在parentElement,也无法计算实际大小大小
         * 我们需要等到上层代码将此类添加到DOM以后 再处理它们
         * 通常情况下 上层代码在创建完毕以后应立即将他添加到dom中
         * 使用requestAnimationFrame可以有效的解决这个问题
         */
        requestAnimationFrame(() => {
            this.editor.layout();
            if (this.parentElement) {
                this.sizeObserver.observe(this.parentElement);
            }
        });
    }
    emit(en: string, data: string) {
        this.dispatchEvent(new CustomEvent(en, {detail: data}));
    }
    destroy() {
        this.sizeObserver.disconnect()
        this.editor.dispose();
    }
}
export default Monaco;