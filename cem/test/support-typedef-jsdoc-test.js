import { expect } from 'chai';
import ts from 'typescript';
import fs, { readFileSync } from 'fs';
import {
  findCustomType, findSubtypes, findTypePath, getConstructorNode, getTypesFromConstructor,
} from '../support-typedef-jsdoc-utils.js';

const filename = 'cem/test/fixtures/cc-test-component.js';
const sourceCode = fs.readFileSync(filename, { encoding: 'utf-8' });
// console.log(sourceCode);
const sourceAst = ts.createSourceFile(filename, sourceCode, ts.ScriptTarget.ES2015, true);
const classNode = sourceAst.statements.find((node) => node.kind === ts.SyntaxKind.ClassDeclaration);

describe('getConstructorNode()', function () {
  it('should ', function () {
    const constructorNode = getConstructorNode(classNode, ts);
    expect(constructorNode.kind).to.equal(ts.SyntaxKind.Constructor);
  });
});

describe('getTypesFromConstructor()', function () {
  const constructorNode = getConstructorNode(classNode, ts);

  it('should ', function () {
    const types = getTypesFromConstructor(constructorNode, ts);
    expect(types).to.have.members(['Foo', 'Bar', 'TheInterface', 'TheType', 'TupleFoo', 'TupleBar']);
  });

});

describe('findCustomType()', function () {
  function testCustomType (jsDocType, expectedType) {
    const source = `
       /** @type {${jsDocType}} - lorem ipsum.  */
       this.union = null;
    `;
    const node = ts.createSourceFile('foo', source, ts.ScriptTarget.ES2015, true).statements[0].jsDoc[0].tags[0].typeExpression.type;
    const type = findCustomType(node, ts);
    expect(type).to.equal(expectedType);
  }

  it('should ', function () {
    testCustomType('Foo[]', 'Foo');
  });

  it('should ', function () {
    testCustomType('string[]', null);
  });

  it('should ', function () {
    testCustomType('Array<string>', null);
  });

  it('should ', function () {
    testCustomType('Array', null);
  });

  it('should ', function () {
    testCustomType('Array<Foo>', 'Foo');
  });

  it('should ', function () {
    testCustomType('Foo', 'Foo');
  });

  // TODO: I have seen one of the member of the team uses this pattern. We might include it afterwards.
  it('should ', function () {
    testCustomType('Foo<Bar>', null);
  });
});

describe('findPath()', function () {

  it('should ', function () {
    const rootDir = process.cwd();
    const moduleDir = 'cem/test/fixtures';
    const importsNode = classNode.jsDoc[0].tags;
    const path = findTypePath(importsNode[0], rootDir, moduleDir);
    expect(path).to.equal(`${rootDir}/${moduleDir}/cc-test-component.types.d.ts`);
  });
});

// TODO: test findSubtypes()
describe('findSubtypes()', function () {
  it('should ', function () {
    // TODO: don't duplicate "fs"
    const rootDir = process.cwd();
    const moduleDir = 'cem/test/fixtures';
    const importsNode = classNode.jsDoc[0].tags;
    const path = findTypePath(importsNode[0], rootDir, moduleDir);
    const sourceCode = readFileSync(path).toString();
    const sourceAst = ts.createSourceFile(path, sourceCode, ts.ScriptTarget.ES2015, true);
    const test = findSubtypes(ts, sourceAst, ['TheInterface', 'TheType']);
    console.log(test);
    expect(findSubtypes(ts, sourceAst, ['TheInterface', 'TheType'])).to.have.members(['SubInterface', 'OtherInterface', 'OtherInterfaceTwo', 'SubType']);
  });
});

// TODO: test the output of convertImports()

// TODO: See if we can split more code and test them
