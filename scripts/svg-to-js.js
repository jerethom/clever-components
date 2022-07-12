import svgtojs from '@nrk/svg-to-js';

const options = {
  input: 'src/assets/remix-icons/Buildings/',
  customOutputs: [{
    parser({ camelCase, svg }) {
      return `export const ${camelCase} = {\n  name: '${camelCase}',\n  value: '${svg}',\n};`;
    },
    filename: 'remix-icons.esm.js'
  }]
}
svgtojs(options);
