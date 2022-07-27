const types = [];

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
