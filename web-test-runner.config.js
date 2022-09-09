import rollupCommonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import { fromRollup, rollupAdapter } from '@web/dev-server-rollup';
import { cemAnalyzerPlugin } from './wds/cem-analyzer-plugin.js';
import { esbuildBundlePlugin } from './wds/esbuild-bundle-plugin.js';

const commonjs = fromRollup(rollupCommonjs);

function commonJsIdentifiers (ids) {
  return ids.map((id) => `**/node_modules/${id}/**/*`);
}

export default {
  files: ['test/**/*.test.*', 'src/components/**/*.test.*'],
  nodeResolve: true,
  mimeTypes: {
    '**/*.md': 'js',
    '**/*.json': 'js',
    '.**/*.json': 'js',
  },
  testFramework: {
    config: {
      ui: 'bdd',
      timeout: '5000',
    },
  },
  testRunnerHtml: (testFramework) => `
    <html>
      <body>
        <link rel="stylesheet" href="src/styles/default-theme.css" >
        <script type="module" src="${testFramework}"></script>
      </body>
    </html>
  `,
  plugins: [
    cemAnalyzerPlugin,
    rollupAdapter(json()),
    esbuildBundlePlugin({
      pathsToBundle: [
        '/src/lib/leaflet-esm.js',
        '/node_modules/rxjs/dist/esm5/index.js',
        '/node_modules/chart.js/dist/chart.esm.js',
      ],
    }),
    commonjs({
      // the commonjs plugin is slow, list the required packages explicitly:
      include: commonJsIdentifiers([
        'statuses',
        // used by clever-client
        'oauth-1.0a',
        'component-emitter',
      ]),
    }),
  ],
};
