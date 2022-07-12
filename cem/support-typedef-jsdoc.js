import { readFileSync, writeFileSync } from 'fs';
import path from 'path';

export default function supportTypedefJsdoc () {

  const typesStore = new Map();
  const fileCache = new Map();
  const moduleTypeCache = new Map();
  const typeMDStore = new Map();

  function findType (type, ts) {

    const isCustomType = type.kind === ts.SyntaxKind.TypeReference || (type.kind === ts.SyntaxKind.ArrayType && type.elementType.kind === ts.SyntaxKind.TypeReference);
    const isArrayType = type.kind === ts.SyntaxKind.ArrayType;
    const isSpecialArray = type?.typeName?.getText() === 'Array';
    const hasSpecialArrayArgs = type?.typeArguments != null && type.typeArguments[0]?.typeName != null;

    if (!isCustomType || (isSpecialArray && !hasSpecialArrayArgs)) {
      return null;
    }

    if (isArrayType) {
      return type.elementType.typeName.getText();
    }
    else if (isSpecialArray) {
      return type.typeArguments[0].typeName.getText();
    }

    return type.getText();
  }

  function convertImports (ts, imports, comp) {
    const asts = [];

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
      const subtypes = findSubtypes(ts, sourceAst, sourceCode, typesFromSet);
      subtypes.forEach((type) => typesSet.add(type));

      typesSet.forEach((type) => {
        if (typeMDStore.has(type)) {
          const comps = typeMDStore.get(type);
          comps.push(comp);
        }
        else {
          typeMDStore.set(type, [comp]);
        }
        return (typesStore.has(`${type}-${filename}`))
          ? asts.push(typesStore.get(`${type}-${filename}`))
          : asts.push(convertInterface(ts, sourceAst, sourceCode, type, filename));
      });

    });

    return asts.join('\n');
  }

  function findSubtypes (ts, node, code, types) {
    const subtypes = [];

    node.statements
      .filter((typeDeclaration) => types.includes(typeDeclaration.name.getText()))
      .forEach((td) => {
        switch (td.kind) {
          case ts.SyntaxKind.TypeAliasDeclaration: {
            td.type?.types?.forEach((t) => {
              const type = findType(t, ts);
              if (type != null) {
                subtypes.push(type);
                subtypes.push(...findSubtypes(ts, node, code, [type]));
              }
            });
            break;
          }
          case ts.SyntaxKind.TupleType: {
            break;
          }
          default: {
            td.members.forEach((t) => {
              const type = findType(t.type, ts);
              if (type != null) {
                subtypes.push(type);
                subtypes.push(...findSubtypes(ts, node, code, [type]));
              }
            });
          }
        }
      });

    console.log(subtypes);

    return subtypes;
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

      // return;

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
      const constructor = node.members.find((member) => member.kind === ts.SyntaxKind.Constructor);
      // Check if we have some component without constructor
      if (constructor == null) {
        return;
      }
      // We then need to retrieve the variables initialized in our constructor
      const constructorNodes = constructor.body.statements;
      const comp = node.name.escapedText;
      console.log('component', node.name.escapedText);
      const types = [];
      // Now that we have our constructor nodes we can find for each node (var) its associated type
      constructorNodes.forEach((node) => {
        // We don't want a node that doesn't contains js doc and the super() keyword
        const isSuper = node.expression?.expression?.kind === ts.SyntaxKind.SuperKeyword;
        const hasJsDoc = node?.jsDoc != null && node.jsDoc.length > 0;
        const isVarInit = node.kind === ts.SyntaxKind.ExpressionStatement && node.expression?.left?.expression.kind === ts.SyntaxKind.ThisKeyword;
        const hasTypeIdentifier = hasJsDoc && node.jsDoc[0].tags[0].kind === ts.SyntaxKind.JSDocTypeTag;
        const isFieldPrivate = !isSuper && isVarInit && node.expression.left.name.getText().charAt(0) === '_';
        if (isSuper || !hasJsDoc || !isVarInit || !hasTypeIdentifier || isFieldPrivate) {
          return;
        }

        const rawType = node.jsDoc[0].tags[0].typeExpression.type;

        const isUnionType = rawType.kind === ts.SyntaxKind.UnionType;
        if (!isUnionType) {
          const foundType = findType(rawType, ts);
          if (foundType != null) {
            types.push(foundType);
          }
        }
        else {
          rawType.types.forEach((type) => {
            const foundType = findType(type, ts);
            if (foundType != null) {
              types.push(foundType);
            }
          });
        }

      });

      // Check the jsDoc of the class and find the imports
      node?.jsDoc?.forEach((jsDoc) => {
        jsDoc.tags
          .filter((tag) => tag.kind === ts.SyntaxKind.JSDocTypedefTag)
          .forEach((tag) => {

            const moduleDir = path.parse(moduleDoc.path).dir;
            // Remove leading and ending quotes
            const typeRelativePath = tag.typeExpression.type.argument?.literal.getText().slice(1, -1);
            const { dir: typeDir, name: typeName } = path.parse(typeRelativePath);

            const typeToTs = path.format({ name: typeName, ext: '.d.ts' });
            const typePath = path.resolve(rootDir, moduleDir, typeDir, typeToTs);

            const typeDefDisplay = tag.name.getText();
            const type = types.find((type) => type === typeDefDisplay);

            if (type != null) {
              (!moduleTypeCache.has(typePath))
                ? moduleTypeCache.set(typePath, new Set([type]))
                : moduleTypeCache.get(typePath).add(type);
            }
          });
      });

      types.forEach((type) => {
      });
      // Now that we have the types, and the path of where the types are located
      // We can convert the imports to md types
      const convertedImports = convertImports(ts, moduleTypeCache, comp);
      const displayText = (convertedImports) ? '### Type Definitions\n\n' + convertedImports : '';
      const declaration = moduleDoc.declarations.find((declaration) => declaration.name === node.name.getText());

      declaration.description = declaration.description + '\n\n' + displayText;

    },
    packageLinkPhase ({ customElementsManifest, context }) {
      const html = [`## Types Reference`];
      const sortedMD = new Map([...typeMDStore].sort());
      for (const [key, value] of sortedMD.entries()) {
        html.push(`### ${key}`);
        value.forEach((comp) => html.push(`* ${comp}`));
      }
      const text = html.join('\n');
      writeFileSync('./docs/references/types.reference.md', text, {
        encoding: 'utf8',
        flag: 'w',
        mode: 0o666,
      });
    },
  };
}
