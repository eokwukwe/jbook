// import { editor } from 'monaco-editor';
import { useRef } from 'react';
import prettier from 'prettier';
import traverse from '@babel/traverse';
import { editor } from 'monaco-editor';
import parser from 'prettier/parser-babel';
import { parse as babelParse } from '@babel/parser';
import MonacoJSXHighlighter from 'monaco-jsx-highlighter';
import MonacoEditor, { OnChange, OnMount } from '@monaco-editor/react';

import './syntax.css';
import './code-editor.css';

interface CodeEditorProps {
  initialValue: string;
  onChange(value: string): void;
}

export default function CodeEditor({
  initialValue,
  onChange,
}: CodeEditorProps) {
  const editorRef = useRef<editor.IStandaloneCodeEditor>();

  const handleEditorChange: OnChange = (value) => {
    if (value) onChange(value);
  };

  const handleEditorDidMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;

    const highlighter = new MonacoJSXHighlighter(
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      monaco,
      babelParse,
      traverse,
      editor
    );
    highlighter.highLightOnDidChangeModelContent(100);
  };

  const onFormatClick = () => {
    // Get editor current value
    const unformatted = editorRef.current?.getValue() || '';

    // Format that value
    const formatted = prettier
      .format(unformatted, {
        parser: 'babel',
        plugins: [parser],
        useTabs: false,
        semi: true,
        singleQuote: true,
      })
      .replace(/\n$/, '');

    // Set the formatted value back in the editor
    editorRef.current?.setValue(formatted);
  };

  return (
    <div className='editor-wrapper'>
      <button
        className='button button-format is-primary is-small'
        onClick={onFormatClick}
      >
        Format
      </button>
      <MonacoEditor
        value={initialValue}
        onChange={handleEditorChange}
        onMount={handleEditorDidMount}
        height='500px'
        defaultLanguage='javascript'
        theme='vs-dark'
        options={{
          tabSize: 2,
          fontSize: 16,
          wordWrap: 'on',
          folding: false,
          showUnused: false,
          automaticLayout: true,
          lineNumbersMinChars: 3,
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
        }}
      />
    </div>
  );
}
