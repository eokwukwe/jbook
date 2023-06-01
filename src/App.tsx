import * as esbuild from 'esbuild-wasm';
import { useEffect, useState, useRef } from 'react';
import { fetchPlugin, unpkgPathPlugin } from './plugins';

function App() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ref = useRef<any>();
  const iframeRef = useRef<any>();

  const [code, setCode] = useState('');
  const [input, setInput] = useState('');

  const startEsbuildService = async () => {
    ref.current = await esbuild.startService({
      worker: true,
      wasmURL: 'https://unpkg.com/esbuild-wasm@0.8.27/esbuild.wasm',
    });
  };

  useEffect(() => {
    startEsbuildService();
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

    iframeRef.current.contentWindow.postMessage(
      result.outputFiles[0].text,
      '*'
    );
  };

  const html = `
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Document</title>
      </head>
      <body>
        <div id="root"></div>
        <script>
          window.addEventListener('message', (event) => {
            eval(event.data);
          }, false);
        </script>
      </body>
    </html>
  `;

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

      <iframe ref={iframeRef} sandbox='allow-scripts' srcDoc={html}></iframe>
    </div>
  );
}

export default App;
