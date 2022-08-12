import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import monoglob from 'glob';
import ts from 'typescript';

import { getConstructorNode, getTypesFromConstructor } from '../cem/support-typedef-jsdoc-utils.js';

function glob (patternList, options) {
  if (typeof patternList === 'string') {
    return monoglob.sync(patternList, options);
  }
  return patternList.flatMap((pattern) => {
    return monoglob.sync(pattern, options);
  });
}

function checkTypeImports (componentName, filepath, sourceCode) {
  const sourceAst = ts.createSourceFile(componentName, sourceCode, ts.ScriptTarget.ES2015, true);
  const classNode = sourceAst.statements.find((node) => node.kind === ts.SyntaxKind.ClassDeclaration);
  const constructorNode = getConstructorNode(classNode, ts);
  if (constructorNode == null) {
    return;
  }

  // Note: The function only takes variables that are initialized in the constructor
  // and not the ones that are private which means if you import a type that is used for a private member
  // the plugin will tell you that this type is possibly an unused import.
  // I kept this behavior for now as IDE seem to still find them and provide intellisense.
  const typesFromConstructor = getTypesFromConstructor(constructorNode, ts);
  const imports = { component: componentName, filepath: filepath, unusedImports: [] };
  classNode?.jsDoc?.forEach((jsDoc) => {
    jsDoc.tags
      .filter((tag) => tag.kind === ts.SyntaxKind.JSDocTypedefTag)
      .forEach((tag) => {

        // Type extracted from @typedef {type} - ....
        const typeDefDisplay = tag.name.getText();

        // Try to find if the import is present in the types of the constructor.
        const type = typesFromConstructor.find((type) => type === typeDefDisplay);

        // If it is not present in the constructor it means that we either have an unused import
        // Or that the person forgot to use it.
        if (type == null) {
          // @typedef {type} ....
          imports.unusedImports.push(`${tag.getText()}`);
        }

      });
  });

  return imports;

}

function run () {
  console.log(
    chalk
      .bgHex('#EAEAEA')
      .hex('#333333')
      .bold(`\n ⌛ checking @typedef imports and types present in constructor..\n`),
  );

  const unusedImports = [];
  const componentsList = glob('src/components/**/cc-*.js', {
    absolute: true, ignore: ['src/components/**/cc-*.stories.js', 'src/components/**/cc-*.smart*'],
  });

  for (const filepath of componentsList) {
    const componentFileName = path.parse(filepath).name;
    const contents = fs.readFileSync(filepath, { encoding: 'utf8' });
    const checkUnusedImports = checkTypeImports(componentFileName, filepath, contents);
    if (checkUnusedImports != null && checkUnusedImports.unusedImports.length !== 0) {
      unusedImports.push(checkUnusedImports);
    }
  }

  if (unusedImports.length === 0) {
    console.log(chalk.bgHex('#098846')(` 🎉 No type imports in the components are unused! `));
    return;
  }

  unusedImports.forEach((unusedImport) => {
    console.log(chalk.hex('#c15807')(`\n ⚠️  Unused import(s) for ${unusedImport.component} in ${unusedImport.filepath} are: `));
    // console.log(`⚠️ Unused import(s) for ${unusedImport.component} in ${unusedImport.filepath} are: `);
    unusedImport.unusedImports.forEach((importation) => console.log(`\t - ${importation}`));
  });

}

run();
