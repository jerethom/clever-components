import { readFileSync } from 'fs';
import path from 'path';
import {
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

    // addon type.d.ts [Foo, Bar...]
    imports.forEach((typesSet, filename) => {
      let sourceCode;
      let sourceAst;
      const inMemoryType = fileCache.get(filename);
      if (inMemoryType == null) {
        sourceCode = readFileSync(filename).toString();
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

      // console.log(Array.from(typesSet));

      typesSet.forEach((type) => {
        (typesStore.has(`${type}-${filename}`))
          ? asts.push(typesStore.get(`${type}-${filename}`))
          : asts.push(convertInterface(ts, sourceAst, sourceCode, type, filename));
      });

    });

    return asts.join('\n');
  }


  function convertInterface (ts, node, code, interfaceName, filename) {
    const st = node?.statements.find((st) => st?.name?.getText() === interfaceName);
    if (st == null) {
      return '';
    }

    const start = st?.modifiers?.find((modifier) => modifier.kind === ts.SyntaxKind.ExportKeyword)?.end ?? st?.pos;
    const typeDeclaration = code.substring(start, st?.end).trim();
    const typeDisplay = '```ts\n\n'
      + typeDeclaration
      + '\n\n```';
    typesStore.set(`${interfaceName}-${filename}`, typeDisplay);
    return typeDisplay;
  }

  return {
    name: 'support-typedef-jsdoc',
    analyzePhase ({ ts, node, moduleDoc }) {

      // First, we need to find the constructor
      // It can be found as a member of ClassDeclaration

      // If the node we loop through is not a ClassDeclaration we don't go any further
      // as we only want the constructor
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

      console.log('component', node.name.escapedText);

      // We then need to retrieve the variables initialized in our constructor
      const types = getTypesFromConstructor(constructorNode, ts);
      // Now that we have our constructor nodes we can find for each node (var) its associated type

      // Check the jsDoc of the class and find the imports
      node?.jsDoc?.forEach((jsDoc) => {
        jsDoc.tags
          .filter((tag) => tag.kind === ts.SyntaxKind.JSDocTypedefTag)
          .forEach((tag) => {

            const moduleDir = path.parse(moduleDoc.path).dir;
            // TODO: tmp convert
            const typePath = findTypePath(tag, rootDir, moduleDir, true);


            const typeDefDisplay = tag.name.getText();

            const type = types.find((type) => type === typeDefDisplay);

            if (type != null) {
              if (!moduleTypeCache.has(typePath)) {
                moduleTypeCache.set(typePath, new Set());
              }
              moduleTypeCache.get(typePath).add(type);
            }
          });
      });

      // Now that we have the types, and the path of where the types are located
      // We can convert the imports to md types
      const convertedImports = convertImports(ts, moduleTypeCache);
      const displayText = (convertedImports) ? '### Type Definitions\n\n' + convertedImports : '';
      const declaration = moduleDoc.declarations.find((declaration) => declaration.name === node.name.getText());

      declaration.description = declaration.description + '\n\n' + displayText;

    },
    // packageLinkPhase ({ customElementsManifest, context }) {
    //   const html = [`## Types Reference`];
    //   const sortedMD = new Map([...typeMDStore].sort());
    //   for (const [key, value] of sortedMD.entries()) {
    //     html.push(`### ${key}`);
    //     value.forEach((comp) => html.push(`* ${comp}`));
    //   }
    //   const text = html.join('\n');
    //   writeFileSync('./docs/references/types.reference.md', text, {
    //     encoding: 'utf8',
    //     flag: 'w',
    //     mode: 0o666,
    //   });
    // },
  };
}
