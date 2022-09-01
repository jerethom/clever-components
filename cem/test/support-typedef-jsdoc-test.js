import fs, { readFileSync } from 'fs';
import { expect } from 'chai';
import ts from 'typescript';
import {
  convertInterface,
  findCustomType, findSubtypes, findTypePath, getConstructorNode, getTypesFromConstructor,
} from '../support-typedef-jsdoc-utils.js';

const filename = 'cem/test/fixtures/cc-test-component.js';
const sourceCode = fs.readFileSync(filename, { encoding: 'utf-8' });
// console.log(sourceCode);
const sourceAst = ts.createSourceFile(filename, sourceCode, ts.ScriptTarget.ES2015, true);
const classNode = sourceAst.statements.find((node) => node.kind === ts.SyntaxKind.ClassDeclaration);

describe('getConstructorNode()', function () {
  it('should get the constructor node.', function () {
    const constructorNode = getConstructorNode(classNode, ts);
    expect(constructorNode.kind).to.equal(ts.SyntaxKind.Constructor);
  });
});

describe('getTypesFromConstructor()', function () {
  const constructorNode = getConstructorNode(classNode, ts);

  it('should retrieve the types present in the constructor.', function () {
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

  it('should return `Type` for a `Type[]` type.', function () {
    testCustomType('Foo[]', 'Foo');
  });

  it('should return `null` for a `primitive[]` type.', function () {
    testCustomType('string[]', null);
  });

  it('should return `null` for a `Array<primitive>` type.', function () {
    testCustomType('Array<string>', null);
  });

  it('should return `null` for a base `Array`.', function () {
    testCustomType('Array', null);
  });

  it('should return `Type` for a `Array<Type>` type.', function () {
    testCustomType('Array<Foo>', 'Foo');
  });

  it('should return `Type` for a non primitive type.', function () {
    testCustomType('Foo', 'Foo');
  });

  // TODO: I have seen one of the member of the team uses this pattern. We might include it afterwards.
  it('should...', function () {
    testCustomType('Foo<Bar>', null);
  });
});

describe('findPath()', function () {

  it('should retrieve the @typedef path from the first one in the test file.', function () {
    const rootDir = process.cwd();
    const moduleDir = 'cem/test/fixtures';
    const importsNode = classNode.jsDoc[0].tags;
    const path = findTypePath(importsNode[0], rootDir, moduleDir);
    expect(path).to.equal(`${rootDir}/${moduleDir}/cc-test-component.types.d.ts`);
  });

  it('should retrieve the common @typedef path located at the end of the test file.', function () {
    const rootDir = process.cwd();
    const moduleDir = 'cem/test/fixtures';
    const importsNode = classNode.jsDoc[0].tags;
    const importLength = importsNode.length;
    const path = findTypePath(importsNode[importLength - 1], rootDir, moduleDir);
    expect(path).to.equal(`${rootDir}/cem/test/common.types.d.ts`);
  });

  it('should return null if the path is correct.', function () {
    const rootDir = process.cwd();
    const moduleDir = 'cem/test/fixtures';
    const importsNode = classNode.jsDoc[0].tags;
    const importLength = importsNode.length;
    const path = findTypePath(importsNode[importLength - 2], rootDir, moduleDir);
    expect(path).to.equal(null);
  });

});

describe('findSubtypes()', function () {
  it('should find the subtypes for a given type/interface', function () {
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

describe('convertInterface()', function () {
  it('should return the needed interface in the type file for a given interface name.', function () {
    const rootDir = process.cwd();
    const moduleDir = 'cem/test/fixtures';
    const importsNode = classNode.jsDoc[0].tags;
    const path = findTypePath(importsNode[0], rootDir, moduleDir);
    const sourceCode = readFileSync(path).toString();
    const sourceAst = ts.createSourceFile(path, sourceCode, ts.ScriptTarget.ES2015, true);
    const interfaceStr = convertInterface(ts, sourceAst, sourceCode, 'TheInterface', path);
    expect(interfaceStr).to.equal(
      '```ts\n\n'
      + 'interface TheInterface {\n'
      + '  one: number;\n'
      + '  two: string;\n'
      + '  sub: SubInterface;\n'
      + '  subSpecialArray: Array<OtherInterface>;\n'
      + '  subArray: OtherInterfaceTwo[];\n'
      + '  subType: SubType;\n'
      + '}\n' + '\n' + '```');
  });
});
