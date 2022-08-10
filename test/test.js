import test from 'node:test';
import assert from 'assert';
import ts from 'typescript';
import { convertImports } from '../cem/support-typedef-jsdoc.js';

test('convertImports()', async (t) => {
  await t.test('it parses correcly', (t) => {
    const map = new Map();
    map.set('/home/mathieu/dev/clever-cloud/clever-components/src/addon/types.d.ts', new Set(['Addon']));
    map.set('/home/mathieu/dev/clever-cloud/clever-components/src/types.d.ts', new Set(['Zone']));
    console.log(convertImports(ts, map));
  });

});

test('convertInterfaces()', async (t) => {
  await t.test('it parses correcly', (t) => {
    const map = new Map();
    map.set('/home/mathieu/dev/clever-cloud/clever-components/src/addon/types.d.ts', new Set(['Addon']));
    map.set('/home/mathieu/dev/clever-cloud/clever-components/src/types.d.ts', new Set(['Zone']));
    console.log(convertImports(ts, map));
  });

});

test('findSubtypes()', async (t) => {
  await t.test('it parses correcly', (t) => {
    const map = new Map();
    map.set('/home/mathieu/dev/clever-cloud/clever-components/src/addon/types.d.ts', new Set(['Addon']));
    map.set('/home/mathieu/dev/clever-cloud/clever-components/src/types.d.ts', new Set(['Zone']));
    console.log(convertImports(ts, map));
  });

});
