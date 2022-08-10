interface ParseError {
  line: number;
  msg: string;
}

interface ParserOptions {
  mode: string;
}

interface Variable {
  name: string;
  value: string;
}
