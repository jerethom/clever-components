import { expect } from 'chai';
import { convertImports } from '../support-typedef-jsdoc.js';
import ts from 'typescript';


describe('convertImports', () => {
  it('parses correcly', () => {
    const map = new Map();
    map.set('/home/mathieu/dev/clever-cloud/clever-components/src/addon/types.d.ts', new Set(['Addon']));
    map.set('/home/mathieu/dev/clever-cloud/clever-components/src/types.d.ts', new Set(['Zone']));
  });
});

describe('convertInterfaces', () => {
  it('parses correcly', () => {
    const map = new Map();
    map.set('/home/mathieu/dev/clever-cloud/clever-components/src/addon/types.d.ts', new Set(['Addon']));
    map.set('/home/mathieu/dev/clever-cloud/clever-components/src/types.d.ts', new Set(['Zone']));
  });
});

describe('findSubtypes', () => {
  it('parses correcly', () => {
    const map = new Map();
    map.set('/home/mathieu/dev/clever-cloud/clever-components/src/addon/types.d.ts', new Set(['Addon']));
    map.set('/home/mathieu/dev/clever-cloud/clever-components/src/types.d.ts', new Set(['Zone']));
  });
});

