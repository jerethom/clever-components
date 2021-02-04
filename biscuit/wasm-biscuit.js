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

export function getBlocks (biscuit) {
  return [
    { code: 'foo' },
    { code: 'bar' },
  ];
}
