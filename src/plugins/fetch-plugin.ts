import axios from 'axios';
import localForage from 'localforage';
import * as esbuild from 'esbuild-wasm';

const fileCache = localForage.createInstance({
  name: 'fileCache',
});

export const fetchPlugin = (inputCode: string) => {
  return {
    name: 'fetch-plugin',
    setup(build: esbuild.PluginBuild) {
      build.onLoad({ filter: /.*/ }, async (args: esbuild.OnLoadArgs) => {
        if (args.path === 'index.js') {
          return { loader: 'jsx', contents: inputCode };
        }

        // Check cache
        const requestURL = args.path;

        const cachedResult = await fileCache.getItem<esbuild.OnLoadResult>(
          requestURL
        );

        if (cachedResult) return cachedResult;

        // Not cached, make a request
        const { data, request } = await axios.get(requestURL);

        const result: esbuild.OnLoadResult = {
          loader: 'jsx',
          contents: data,
          resolveDir: new URL('./', request.responseURL).pathname,
        };

        // cache the result
        await fileCache.setItem(requestURL, result);

        return result;
      });
    },
  };
};
