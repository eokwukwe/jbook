import * as esbuild from 'esbuild-wasm';

export function unpkgPathPlugin() {
  return {
    name: 'unpkg-path-plugin',
    setup(build: esbuild.PluginBuild) {
      // Handle root entry file of 'index.js'
      build.onResolve({ filter: /(^index\.js$)/ }, () => ({
        path: 'index.js',
        namespace: 'a',
      }));

      // Handle relative path in a module. File path that includes './' or '../'.
      build.onResolve(
        { filter: /^\.+\// },
        async (args: esbuild.OnResolveArgs) => {
          const resolvedURL = new URL(
            args.path,
            `https://unpkg.com${args.resolveDir}/`
          ).href;

          return { namespace: 'a', path: resolvedURL };
        }
      );

      // Handle main file of module
      build.onResolve({ filter: /.*/ }, async (args: esbuild.OnResolveArgs) => {
        return {
          namespace: 'a',
          path: `https://www.unpkg.com/${args.path}`,
        };
      });
    },
  };
}
