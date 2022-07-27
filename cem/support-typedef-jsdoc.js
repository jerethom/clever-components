import { readFileSync } from 'fs';
import path from 'path';

export default function supportTypedefJsdoc () {

  const typesStore = new Map();
  const fileCache = new Map();
  const moduleTypeCache = new Map();
  // const typeMDStore = new Map();

  // TODO: test, test, test!!!!!
  function findCustomType (nodeType, ts) {

    const isCustomType = nodeType.kind === ts.SyntaxKind.TypeReference
      || (nodeType.kind === ts.SyntaxKind.ArrayType && nodeType?.elementType?.kind === ts.SyntaxKind.TypeReference);
    const isArrayType = nodeType.kind === ts.SyntaxKind.ArrayType;
    // Array
    const isSpecialArray = nodeType?.typeName?.getText() === 'Array';
    // Array<Foo>
    const hasSpecialArrayArgs = nodeType?.typeArguments != null && nodeType.typeArguments[0]?.typeName != null;

    if (!isCustomType || (isSpecialArray && !hasSpecialArrayArgs)) {
      return null;
    }

    if (isArrayType) {
      return nodeType.elementType.typeName.getText();
    }
    else if (isSpecialArray) {
      return nodeType.typeArguments[0].typeName.getText();
    }

    return nodeType.getText();
  }

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
      const subtypes = findSubtypes(ts, sourceAst, sourceCode, typesFromSet);
      subtypes.forEach((type) => typesSet.add(type));

      typesSet.forEach((type) => {
         (typesStore.has(`${type}-${filename}`))
          ? asts.push(typesStore.get(`${type}-${filename}`))
          : asts.push(convertInterface(ts, sourceAst, sourceCode, type, filename));
      });

    });

    return asts.join('\n');
  }

  // [number, Baz,...]
  function handleTuple (tuple, node, ts) {
    const types = [];
    tuple.type?.elements.forEach((element) => {
      const type = findCustomType(element, ts);
      if (type != null) {
        types.push(type);
        types.push(...findSubtypes(ts, node, [type]));
      }
    });
    return types;
  }

  // interface {...}
  function handleInterface (typeInterface, node, ts) {
    const types = [];
    typeInterface.members.forEach((t) => {
      const type = findCustomType(t.type, ts);
      if (type != null) {
        types.push(type);
        types.push(...findSubtypes(ts, node, [type]));
      }
      else if (t.type.kind === ts.SyntaxKind.TupleType) {
        types.push(...handleTuple(t.type, node, ts));
      }
      else if (t.type.kind === ts.SyntaxKind.UnionType) {
        types.push(...handleUnion(t.type, node, ts));
      }
    });
    return types;
  }

  // type foo = ...;
  function handleTypeDeclaration (typeDeclaration, node, ts) {
    const types = [];
    typeDeclaration?.types?.forEach((t) => {
      const type = findCustomType(t, ts);
      if (type != null) {
        types.push(type);
        types.push(...findSubtypes(ts, node, [type]));
      }
    });
    return types;
  }

  function handleUnion (unionType, node, ts) {
    const types = [];
    unionType?.types?.forEach((t) => {
      const type = findCustomType(t, ts);
      if (type != null) {
        types.push(type);
        types.push(...findSubtypes(ts, node, [type]));
      }
    });
    return types;
  }

  // TODO: now that we have a function that does handle Tuple Type
  // Don't we want to have specific functions to handle these types (e.g: Union Type)

  function findSubtypes (ts, node, types) {
    const subtypes = [];


    node.statements
      .filter((typeDeclaration) => types.includes(typeDeclaration.name.getText()))
      .forEach((td) => {
        switch (td.kind) {
          case ts.SyntaxKind.TypeAliasDeclaration: {
            subtypes.push(...handleTypeDeclaration(td));
            break;
          }
          case ts.SyntaxKind.TupleType: {
            subtypes.push(...handleTuple(td, node, ts));
            break;
          }
          default: {
            subtypes.push(...handleInterface(td, node, ts));
          }
        }
      });

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
        // We don't want a node that doesn't contain jsDoc and the super() keyword
        // We also want to make sure that the field that we're going through is a var init (this.X = Y)
        // and that the field is not private (no this._X = Y)
        const isSuper = node.expression?.expression?.kind === ts.SyntaxKind.SuperKeyword;
        const hasJsDoc = node?.jsDoc != null && node.jsDoc.length > 0;
        const isVarInit = node.kind === ts.SyntaxKind.ExpressionStatement && node.expression?.left?.expression.kind === ts.SyntaxKind.ThisKeyword;
        const hasTypeIdentifier = hasJsDoc && node.jsDoc[0].tags[0].kind === ts.SyntaxKind.JSDocTypeTag;
        const isFieldPrivate = !isSuper && isVarInit && node.expression.left.name.getText().charAt(0) === '_';
        if (isSuper || !hasJsDoc || !isVarInit || !hasTypeIdentifier || isFieldPrivate) {
          return;
        }

        // Retrieve only the first @type found
        const rawType = node.jsDoc[0].tags[0].typeExpression.type;

        const isUnionType = rawType.kind === ts.SyntaxKind.UnionType;
        // TODO: should there be anything else than an union type {type|type} in '@typedef {type} - desc. ?
        if (isUnionType) {
          rawType.types.forEach((type) => {
            const foundType = findCustomType(type, ts);
            if (foundType != null) {
              types.push(foundType);
            }
          });
        }
        else {
          const foundType = findCustomType(rawType, ts);
          if (foundType != null) {
            types.push(foundType);
          }
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
