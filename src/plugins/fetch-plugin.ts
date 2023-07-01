import axios from 'axios';
import localForage from 'localforage';
import * as esbuild from 'esbuild-wasm';

const fileCache = localForage.createInstance({
  name: 'fileCache',
});

export function fetchPlugin(inputCode: string) {
  return {
    name: 'fetch-plugin',
    setup(build: esbuild.PluginBuild) {
      build.onLoad({ filter: /(^index\.js$)/ }, () => ({
        loader: 'jsx',
        contents: inputCode,
      }));

      // Handle cache checking
      build.onLoad({ filter: /.*/ }, async (args: esbuild.OnLoadArgs) => {
        // Check cache
        const cachedResult = await fileCache.getItem<esbuild.OnLoadResult>(
          args.path
        );

        if (cachedResult) return cachedResult;
      });

      // Handle css files
      build.onLoad({ filter: /.css$/ }, async (args: esbuild.OnLoadArgs) => {
        // Not cached, make a request
        const { data, request } = await axios.get(args.path);

        const escapedData = data
          .replace(/\n/g, '')
          .replace(/"/g, '\\"')
          .replace(/'/g, "\\'");

        const contents = `
              const style = document.createElement('style');
              style.innerText = '${escapedData}';
              document.head.appendChild(style);     
              `;

        const result: esbuild.OnLoadResult = {
          loader: 'jsx',
          contents,
          resolveDir: new URL('./', request.responseURL).pathname,
        };

        // cache the result
        await fileCache.setItem(args.path, result);

        return result;
      });

      // Handle js files
      build.onLoad({ filter: /.*/ }, async (args: esbuild.OnLoadArgs) => {
        // Not cached, make a request
        const { data, request } = await axios.get(args.path);

        const result: esbuild.OnLoadResult = {
          loader: 'jsx',
          contents: data,
          resolveDir: new URL('./', request.responseURL).pathname,
        };

        // cache the result
        await fileCache.setItem(args.path, result);

        return result;
      });
    },
  };
}
