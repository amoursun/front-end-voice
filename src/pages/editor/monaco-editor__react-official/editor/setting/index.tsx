import {useState, useRef} from 'react';
import {observer} from 'mobx-react';
import cx from 'classnames';
import {Button, Divider, Typography, Select} from 'antd';
import Editor from '@monaco-editor/react';
import {editor} from 'monaco-editor';
import {store} from '../../store';
import {config} from '../../config';
import style from './style.module.scss';
import {defineTheme, monacoThemes} from '../../store/define-theme';
import {IMonacoTheme, IThemeEnum, IThemeType} from '../../store/type';

const {Paragraph} = Typography;
export const Setting = observer((props: {className?: string}) => {
  const [isEditorReady, setIsEditorReady] = useState(false);
  const {
    editor: {
      selectedLanguageId,
      options,
      setSelectedLanguageId,
      setOptions,
      setMonacoTheme,
      monacoTheme,
    },
  } = store;

  const editorRef = useRef<editor.IStandaloneCodeEditor>();

  const handleLanguageChange = (id: number) => {
    setSelectedLanguageId(id);
  };

  const handleThemeChange = (theme: IThemeType) => {
    if (config.defaultThemes.includes(theme as IThemeEnum)) {
      setMonacoTheme(theme);
    }
    else {
      defineTheme(theme as IMonacoTheme).then(() => setMonacoTheme(theme));
    }
  };
  const handleEditorDidMount = (editor: editor.IStandaloneCodeEditor) => {
    setIsEditorReady(true);
    editorRef.current = editor;
  };

  const handleApply = () => {
    try {
      setOptions(JSON.parse(editorRef.current?.getValue() || ''));
    }
    catch {
      console.error('Invalid options')
    }
  };

  return (
    <div className={cx(style.setting, props.className)}>
      <div className={style.title}>Settings</div>
      <Divider />
      <Typography.Title level={5}>
        <div className={style.languages}>
          <div>Languages</div>
          <Select
            className={style.select}
            value={selectedLanguageId}
            options={config.supportedLanguages.map(language => ({
              value: language.id,
              label: language.name,
            }))}
            onChange={handleLanguageChange}
          />
        </div>
      </Typography.Title>
      <Typography.Title level={5}>
        <div className={style.themes}>
          <div>Themes</div>
          <Select
            className={style.select}
            value={monacoTheme}
            options={[
              ...config.defaultThemes.map(theme => ({
                value: theme,
                label: theme,
              })),
              ...Object.entries(monacoThemes).map(([themeId, themeName]) => ({
                value: themeId,
                label: themeName,
              })),
            ]}
            onChange={handleThemeChange}
          />
        </div>
      </Typography.Title>
      <div className={style.options}>
        <Typography.Title level={5}>Options</Typography.Title>
        <Paragraph>
          Now you can change options below, press apply and see result in the left side editor.
        </Paragraph>
        <div className={style.editor}>
          <Editor
            theme={monacoTheme}
            language="json"
            height={400}
            value={JSON.stringify(options, null, 2)}
            onMount={handleEditorDidMount}
          />
        </div>
        <Button type="primary" disabled={!isEditorReady} onClick={handleApply}>Apply</Button>
      </div>
    </div>
  );
});
