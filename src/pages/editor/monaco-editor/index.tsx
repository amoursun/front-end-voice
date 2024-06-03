import {useState, useRef, useMemo} from 'react'
import {Button, Input} from 'antd';
import style from './style.module.scss';

export const MonacoEditor = () => {
  return (
    <div className={style.monacoEditor}>
      <a href="https://aydk.site/editor/enumerations.html">Monaco-editor 学习文档</a>
      <a href="https://github.com/microsoft/monaco-editor">Monaco Editor (github)</a>
      <a href="https://microsoft.github.io/monaco-editor/">Monaco Editor 官网</a>
      <a href="https://microsoft.github.io/monaco-editor/playground.html">Monaco Editor Playground</a>
      <a href="https://microsoft.github.io/monaco-editor/typedoc/index.html">Monaco Editor API</a>
    </div>
  );
};

export default MonacoEditor;
