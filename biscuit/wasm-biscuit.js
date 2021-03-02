export function parse (code) {
  return {
    ast: code.toUpperCase(),
  };
}

export function getDatalog (biscuit) {
  return `// this is the datalog
${biscuit}
  `;
}

// should generate blocks from an existing token
export function getBlocks (biscuit) {
  return [
    { code: 'foo($test) <- aa($test, "hello", 123);' },
//    { code: 'bar' },
  ];
}

export function getVerifier (biscuit) {
  return 'allow if true;';
}
