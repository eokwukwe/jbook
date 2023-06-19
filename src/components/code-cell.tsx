import { useState } from 'react';

import Preview from './preview';
import CodeEditor from './code-editor';

import bundler from '../bundler';

export default function CodeCell() {
  const [code, setCode] = useState('');
  const [input, setInput] = useState('');

  const handleClick = async () => {
    const output = await bundler(input);
    setCode(output);
  };

  return (
    <div>
      <CodeEditor
        initialValue='const a = 1;'
        onChange={(value) => setInput(value)}
      />

      <div>
        <button onClick={handleClick}>Submit</button>
      </div>

      <Preview code={code} />
    </div>
  );
}
