import { readFileSync } from 'fs';
import path from 'path';
import {
  convertInterface,
  findSubtypes, findTypePath,
  getConstructorNode,
  getTypesFromConstructor,
} from './support-typedef-jsdoc-utils.js';

export default function supportTypedefJsdoc () {

  const typesStore = new Map();
  const fileCache = new Map();
  const moduleTypeCache = new Map();

  // const typeMDStore = new Map();

  function convertImports (ts, imports) {
    const asts = [];

    // type-cc-x.d.ts => [Foo, Bar...]
    imports.forEach((typesSet, filename) => {
      let sourceCode;
      let sourceAst;
      const inMemoryType = fileCache.get(filename);
      if (inMemoryType == null) {
        try {
          sourceCode = readFileSync(filename).toString();
        }
        catch (e) {
          console.log(e);
          return;
        }
        sourceAst = ts.createSourceFile(filename, sourceCode, ts.ScriptTarget.ES2015, true);
        fileCache.set(filename, { code: sourceCode, ast: sourceAst });
      }
      else {
        sourceCode = inMemoryType.code;
        sourceAst = inMemoryType.ast;
      }

      const typesFromSet = Array.from(typesSet);
      const subtypes = findSubtypes(ts, sourceAst, typesFromSet);
      subtypes.forEach((type) => typesSet.add(type));

      typesSet.forEach((type) => {
        (typesStore.has(`${type}-${filename}`))
          ? asts.push(typesStore.get(`${type}-${filename}`))
          : asts.push(convertInterface(ts, sourceAst, sourceCode, type, filename, typesStore));
      });

    });

    return asts.join('\n');
  }

  return {
    name: 'support-typedef-jsdoc',
    analyzePhase ({ ts, node, moduleDoc }) {

      // First, we need to find the constructor
      // It can be found as a member of ClassDeclaration

      // If the node we loop through is not a ClassDeclaration we don't go any further
      // as we only want access to the constructor and JSDoc above the class to find the imports.
      if (node.kind !== ts.SyntaxKind.ClassDeclaration) {
        return;
      }

      moduleTypeCache.clear();
      const rootDir = process.cwd();

      // Now that we're in ClassDeclaration we find the constructor
      const constructorNode = getConstructorNode(node, ts);

      // Check if we have some component without constructor
      if (constructorNode == null) {
        return;
      }

      console.log('⌛ Generating docs for', node.name.escapedText);

      const types = getTypesFromConstructor(constructorNode, ts);
      // Check the jsDoc of the class and find the imports

      // This find the comment where the imports are located
      const typeDefNode = node?.jsDoc?.filter((node) => node.tags.find((tag) => tag.kind === ts.SyntaxKind.JSDocTypedefTag))?.[0];

      typeDefNode?.tags
        ?.forEach((tag) => {

          // Detect if an import is not correct and warn the plugin user.
          if (tag.kind !== ts.SyntaxKind.JSDocTypedefTag) {
            console.log('Something in your @typedef imports is wrong.');
            return;
          }

          const moduleDir = path.parse(moduleDoc.path).dir;

          const typePath = findTypePath(tag, rootDir, moduleDir);

          const typeDefDisplay = tag.name.getText();

          const type = types.find((type) => type === typeDefDisplay);

          if (type != null) {
            if (!moduleTypeCache.has(typePath)) {
              moduleTypeCache.set(typePath, new Set());
            }
            moduleTypeCache.get(typePath).add(type);
          }
        });

      // Now that we have the types, and the path of where the types are located
      // We can convert the imports to md types
      const convertedImports = convertImports(ts, moduleTypeCache);
      const displayText = (convertedImports) ? '### Type Definitions\n\n' + convertedImports : '';
      const declaration = moduleDoc.declarations.find((declaration) => declaration.name === node.name.getText());

      declaration.description = declaration.description + '\n\n' + displayText;

    },
  };
}
