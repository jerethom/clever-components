// vite.config.js
export default {
  optimizeDeps: {
    exclude: [
      '@web/dev-server',
      '@web/dev-server-rollup',
      '@web/dev-server-storybook',
      '@web/rollup-plugin-import-meta-assets',
      '@web/test-runner',
      '@web/test-runner-mocha',
    ],
  },
};

