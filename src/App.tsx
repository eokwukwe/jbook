import { useState } from 'react';

import bundler from './bundler';

import Preview from './components/preview';
import CodeEditor from './components/code-editor';

function App() {
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

export default App;
