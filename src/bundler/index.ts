import * as esbuild from 'esbuild-wasm';

import { fetchPlugin, unpkgPathPlugin } from '../plugins';

let service: esbuild.Service;

async function bundler(rawCode: string) {
  if (!service) {
    service = await esbuild.startService({
      worker: true,
      wasmURL: 'https://unpkg.com/esbuild-wasm@0.8.27/esbuild.wasm',
    });
  }

  // Work around for define.process.env.NODE_ENV for vite
  const env = ['process', 'env', 'NODE_ENV'].join('.');

  try {
    const result = await service.build({
      entryPoints: ['index.js'],
      bundle: true,
      write: false,
      plugins: [unpkgPathPlugin(), fetchPlugin(rawCode)],
      define: { [env]: '"production"', global: 'window' },
    });

    return { code: result.outputFiles[0].text, error: '' };
  } catch (error) {
    return { code: '', error: (error as Error).message };
  }
}

export default bundler;
