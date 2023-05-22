import * as esbuild from 'esbuild-wasm';
import { useEffect, useState, useRef } from 'react';
import { fetchPlugin, unpkgPathPlugin } from './plugins';

function App() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ref = useRef<any>();
  const [code, setCode] = useState('');
  const [input, setInput] = useState('');

  const startService = async () => {
    ref.current = await esbuild.startService({
      worker: true,
      wasmURL: '/esbuild.wasm',
    });
  };

  useEffect(() => {
    startService();
  }, []);

  const handleClick = async () => {
    if (!ref.current) return;

    // Work around for define.process.env.NODE_ENV for vite
    const env = ['process', 'env', 'NODE_ENV'].join('.');

    const result = await ref.current.build({
      entryPoints: ['index.js'],
      bundle: true,
      write: false,
      plugins: [unpkgPathPlugin(), fetchPlugin(input)],
      define: {
        [env]: '"production"',
        global: 'window',
      },
    });

    console.log(result);

    setCode(result.outputFiles[0].text);
  };

  return (
    <div>
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
      ></textarea>
      <div>
        <button onClick={handleClick}>Submit</button>
      </div>

      <pre>{code}</pre>
    </div>
  );
}

export default App;
