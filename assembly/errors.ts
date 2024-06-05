import { Token, TokenType } from './Token';

let hadError = false;
function report(line: i32, where: string, message: string): void {
  console.error(`[line ${line.toString()}] Error${where}: ${message}`);
  hadError = true;
}

export function getHadError(): boolean {
  return hadError;
}

export function error(line: i32, message: string): void {
  report(line, '', message);
}

export function tokenError(token: Token, message: string): void {
  if (token.type == TokenType.EOF) {
    report(token.line, ' at end', message);
  } else {
    report(token.line, ` at '${token.lexeme}'`, message);
  }
}

export class ParseError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'エラー';
  }
}

export function parserError(token: Token, message: string): ParseError {
  console.log('error called');
  // tokenError(token, message);
  const Ero = new ParseError(message);
  Ero.name = 'hello';
  return Ero;
}

export class RuntimeError extends Error {
  token: Token;

  constructor(token: Token, message: string) {
    super(message);
    this.token = token;
    this.name = 'RunTimeError';
  }
}

export function runtimeError(token: Token, message: string): Error {
  return new Error('you forget It');
  // return new RuntimeError(token, message);
}
