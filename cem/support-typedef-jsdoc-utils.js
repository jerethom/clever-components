import path from 'path';

export function getConstructorNode (classNode, ts) {
  return classNode.members.find((member) => member.kind === ts.SyntaxKind.Constructor);
}

export function getTypesFromConstructor (constructorNode, ts) {
  const constructorTypes = new Set();

  constructorNode.body.statements.forEach((node) => {

    if (!isVarInitWithDoc(node, ts)) {
      return;
    }

    // Retrieve only the first @type found
    const rawType = node.jsDoc[0].tags[0].typeExpression.type;

    const isUnionType = rawType.kind === ts.SyntaxKind.UnionType;
    const isTupleType = rawType.kind === ts.SyntaxKind.TupleType;
    let types;

    if (isUnionType) {
      types = rawType.types;
    }
    else if (isTupleType) {
      // ASTExplorer see tuples types as 'elements' however TS in cem sees them as 'elementTypes'
      // Still can't figure out why
      types = rawType.elementTypes;
    }
    else {
      types = [rawType];
    }
    types.forEach((type) => {
      const foundType = findCustomType(type, ts);
      if (foundType != null) {
        constructorTypes.add(foundType);
      }
    });

  });

  return Array.from(constructorTypes);

}

export function findCustomType (nodeType, ts) {

  // Type[] (not primitive[])
  const isArrayType = nodeType.kind === ts.SyntaxKind.ArrayType && nodeType?.elementType?.kind === ts.SyntaxKind.TypeReference;
  if (isArrayType) {
    return nodeType.elementType.typeName.getText();
  }

  // Type, Array<any>, Array
  const isCustomType = nodeType.kind === ts.SyntaxKind.TypeReference;
  const isCustomTypeArray = nodeType?.typeName?.getText() === 'Array';
  const hasSpecialArrayArgs = nodeType.typeArguments?.[0]?.typeName != null;

  // Type
  if (isCustomType && !isCustomTypeArray && !hasSpecialArrayArgs) {
    return nodeType.getText();
  }

  // Array<Type>
  if (isCustomType && isCustomTypeArray && hasSpecialArrayArgs) {
    return nodeType.typeArguments[0].typeName.getText();
  }

  return null;
}

function isVarInitWithDoc (node, ts) {
  // We don't want a node that doesn't contain jsDoc and the super() keyword
  // We also want to make sure that the field that we're going through is a var init (this.X = Y)
  // and that the field is not private (no this._X = Y)
  const isBinaryExpression = node.kind === ts.SyntaxKind.ExpressionStatement && node.expression.kind === ts.SyntaxKind.BinaryExpression;
  const isVarInit = isBinaryExpression && node.expression?.left?.expression.kind === ts.SyntaxKind.ThisKeyword;
  const hasJsDoc = node?.jsDoc != null && node.jsDoc.length > 0;
  const hasTypeIdentifier = hasJsDoc && node.jsDoc[0].tags[0].kind === ts.SyntaxKind.JSDocTypeTag;
  const isFieldPrivate = isVarInit && node.expression.left.name.getText().charAt(0) === '_';

  return isVarInit && hasJsDoc && hasTypeIdentifier && !isFieldPrivate;
}

export function findTypePath (importTag, rootDir, moduleDir) {
  // Remove leading and ending quotes
  const typeRelativePath = importTag.typeExpression?.type?.argument?.literal.getText().slice(1, -1);

  if (typeRelativePath == null) {
    console.log('theres a problem with one of the @typedef in the component.');
    return null;
  }

  const { dir: typeDir, name: typeName } = path.parse(typeRelativePath);
  const typeToTs = path.format({ name: typeName, ext: '.d.ts' });

  return path.resolve(rootDir, moduleDir, typeDir, typeToTs);
}

export function findSubtypes (ts, node, types) {
  const subtypes = [];

  const fetch = node.statements
    .filter((typeDeclaration) => types.includes(typeDeclaration.name?.getText()));

  fetch
    .forEach((td) => {
      switch (td.kind) {
        case ts.SyntaxKind.TypeAliasDeclaration: {
          subtypes.push(...handleTypeDeclaration(td.type, node, ts));
          break;
        }
        default: {
          subtypes.push(...handleInterface(td, node, ts));
        }
      }
    });

  return Array.from(new Set(subtypes));

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

export function convertInterface (ts, node, code, interfaceName, filename, typesStore = null) {
  const st = node?.statements.find((st) => st?.name?.getText() === interfaceName);
  if (st == null) {
    return '';
  }

  const start = st?.modifiers?.find((modifier) => modifier.kind === ts.SyntaxKind.ExportKeyword)?.end ?? st?.pos;
  const typeDeclaration = code.substring(start, st?.end).trim();
  const typeDisplay = '```ts\n\n'
    + typeDeclaration
    + '\n\n```';
  typesStore?.set(`${interfaceName}-${filename}`, typeDisplay);
  return typeDisplay;
}
