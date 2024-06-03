import {useState, useRef, useMemo} from 'react'
import {Button, Input, Link} from 'antd';
import style from './style.module.scss';

export const MonacoEditor = () => {
  return (
    <div className={style.monacoEditor}>
      <Link href="https://aydk.site/editor/enumerations.html">Monaco-editor 学习文档</Link>
      <Link href="https://github.com/microsoft/monaco-editor">Monaco Editor (github)</Link>
      <Link href="https://microsoft.github.io/monaco-editor/">Monaco Editor 官网</Link>
      <Link href="https://microsoft.github.io/monaco-editor/playground.html">Monaco Editor Playground</Link>
      <Link href="https://microsoft.github.io/monaco-editor/typedoc/index.html">Monaco Editor API</Link>
    </div>
  );
};

export default MonacoEditor;
