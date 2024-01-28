import * as esbuild from "esbuild-wasm";
import axios from "axios";
import localforage from "localforage";

const fileCache = localforage.createInstance({
  name: "filecache",
});

// (async () => {
//   await fileCache.setItem("color", "red");
//   const color = await fileCache.getItem("color");
// })();

export const fetchPlugin = (inputCode: string) => {
  return {
    name: "fetch-plugin",
    setup(build: esbuild.PluginBuild) {
      build.onLoad({ filter: /(^index\.js$)/ }, () => {
        return {
          loader: "jsx",
          contents: inputCode,
        };
      });

      build.onLoad({ filter: /.*/ }, async (args: any) => {
        // Check to see if we have already fetched this file and it already exists is in cache
        // Browser's IndexedDB
        const cachedResult = await fileCache.getItem<esbuild.OnLoadResult>(
          args.path
        );
        // If it exists in cache of browser's IndexedDB, return it immediately
        if (cachedResult) {
          return cachedResult;
        }
      });

      build.onLoad({ filter: /\.css$/ }, async (args: any) => {
        const { data, request } = await axios.get(args.path);

        const escaped = data
          .replace(/\n/g, "")
          .replace(/"/g, '\\"')
          .replace(/'/g, "\\'");

        const contents = `
            const style = document.createElement('style');
            style.innerText = '${escaped}';
            document.head.appendChild(style);
            `;

        const result: esbuild.OnLoadResult = {
          loader: "jsx",
          contents: contents,
          resolveDir: new URL("./", request.responseURL).pathname,
        };

        // Store response in cache
        await fileCache.setItem(args.path, result);

        return result;
      });

      build.onLoad({ filter: /.*/ }, async (args: any) => {
        const { data, request } = await axios.get(args.path);
        // console.log("args.path = ", args.path);
        // console.log("Request.responseURL = ", request.responseURL);
        const result: esbuild.OnLoadResult = {
          loader: "jsx",
          contents: data,
          resolveDir: new URL("./", request.responseURL).pathname,
        };

        // Store response in cache
        await fileCache.setItem(args.path, result);

        return result;
      });

      build.onLoad({ filter: /\.(ts|tsx)$/ }, async (args: any) => {
        // Check if the file is in the cache
        const cachedResult = await fileCache.getItem<esbuild.OnLoadResult>(
          args.path
        );
        if (cachedResult) {
          return cachedResult;
        }

        // Fetch TypeScript file
        const { data, request } = await axios.get(args.path);
        const result: esbuild.OnLoadResult = {
          loader: "tsx", // Use 'tsx' loader for both .ts and .tsx files
          contents: data,
          resolveDir: new URL("./", request.responseURL).pathname,
        };

        // Cache the result
        await fileCache.setItem(args.path, result);
        return result;
      });
    },
  };
};
