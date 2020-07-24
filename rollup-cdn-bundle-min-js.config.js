import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import resolve from '@rollup/plugin-node-resolve';
import clear from 'rollup-plugin-clear';
import { terserPlugin } from './rollup-common.js';
import { importMetaUrlAssets } from './rollup-plugin-import-meta-url-assets.js';

const OUTPUT_DIR = `cdn/bundle-min-js`;

export default {
  input: 'src/index.js',
  output: {
    dir: OUTPUT_DIR,
    sourcemap: true,
  },
  treeshake: false,
  plugins: [
    clear({
      targets: [OUTPUT_DIR],
    }),
    importMetaUrlAssets({
      // Let's assume we don't have import.meta.url assets in our deps to speed up things
      exclude: 'node_modules/**',
    }),
    json(),
    terserPlugin,
    // teaches Rollup how to find external modules (bare imports)
    resolve(),
    // convert CommonJS modules to ES6, so they can be included in a Rollup bundle
    commonjs(),
  ],
};