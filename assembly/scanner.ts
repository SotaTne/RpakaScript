import { Token, TokenType } from './Token';
import { error } from './errors';
import LiteralType from './literalType';

export default class Scanner {
  source: string;

  tokens: Array<Token> = [];

  start: i32 = 0;

  current: i32 = 0;

  line: i32 = 1;

  keywords: Map<string, TokenType> = new Map<string, TokenType>();

  constructor(source: string) {
    this.source = source;
    this.setKeywords();
  }

  setKeywords(): void {
    this.keywords.set('break', TokenType.BREAK);
    // this.keywords.set("continue", TokenType.CONTINUE);
    // this.keywords.set("struct", TokenType.STRUCT);
    this.keywords.set('else', TokenType.ELSE);
    this.keywords.set('false', TokenType.FALSE);
    this.keywords.set('for', TokenType.FOR);
    this.keywords.set('fn', TokenType.FN);
    this.keywords.set('if', TokenType.IF);
    this.keywords.set('nil', TokenType.NIL);
    this.keywords.set('return', TokenType.RETURN);
    this.keywords.set('const', TokenType.CONST);
    this.keywords.set('true', TokenType.TRUE);
    this.keywords.set('var', TokenType.VAR);
    this.keywords.set('while', TokenType.WHILE);
    // this.keywords.set('pipe', TokenType.PIPE);
  }

  advance(): string {
    // 現在の文字を取得して一つ先に進む
    const currentChar = this.source.charAt(this.current);
    this.current++;
    return currentChar;
  }

  isAtEnd(): boolean {
    // テキストの最後かどうかの確認
    return this.current >= this.source.length;
  }

  addToken(type: TokenType, literal: string, literalType: LiteralType): void {
    // Tokenの追加
    // type:Tokenの種類
    // literal:追加の要素 ex.文字列の中身など
    // LiteralType:literalの型
    let text: string = this.source.slice(this.start, this.current);
    if (type == TokenType.STRING) {
      text = literal;
    }
    this.tokens.push(new Token(type, text, literal, this.line, literalType));
  }

  addToken_OnlyType(type: TokenType): void {
    // TokenをTokenTypeのみで決めれるもの
    this.addToken(type, '', LiteralType.NIL);
  }

  peek(): string {
    // 現在の文字を取得
    if (this.isAtEnd()) return '\0';
    return this.source.charAt(this.current);
  }

  nextPeek(): string {
    // 一つ次の文字を取得
    if (!(this.current + 1 >= this.source.length)) {
      return '\0';
    }
    return this.source.charAt(this.current + 1);
  }

  peekMatch(pattern: string): boolean {
    // 現在の文字がpatternと合っているかを取得
    if (this.peek().charCodeAt(0) == pattern.charCodeAt(0)) {
      return true;
    }
    return false;
  }

  peek_next_Match(pattern: string, nextPattern: string): boolean {
    // 現在の文字がpatternと、次の文字がnextPatternと合っているかを取得
    if (!(this.current + 1 >= this.source.length)) {
      if (
        this.peek().charCodeAt(0) == pattern.charCodeAt(0) &&
        this.nextPeek().charCodeAt(0) == nextPattern.charCodeAt(0)
      ) {
        return true;
      }
      return false;
    }
    return false;
  }

  nextMatch(c: string): boolean {
    // 現在の文字を取得して、cに一致するかを比較
    // 合っていたら一文字進める
    if (this.peekMatch(c) && !this.isAtEnd()) {
      this.current++;
      return true;
    }
    return false;
  }

  scan_slash_or_comment(): void {
    // スラッシュかコメントかどっちかを判別して、スラッシュのみを取得。コメントはスキップ
    if (this.nextMatch('/')) {
      while (
        !this.isAtEnd() &&
        this.source.charCodeAt(this.current) !== '\n'.charCodeAt(0)
      ) {
        this.advance();
      }
    } else if (this.nextMatch('*')) {
      while (!this.isAtEnd()) {
        if (this.source.charCodeAt(this.current) == '\n'.charCodeAt(0)) {
          this.line++;
          this.advance();
        } else if (this.peek_next_Match('*', '/')) {
          this.advance();
          this.advance();
          break;
        } else {
          this.advance();
        }
      }
    } else {
      this.addToken_OnlyType(TokenType.SLASH);
    }
  }

  scanString(patternStr: string): void {
    // patternStr( " または ' )
    // stringの要素を取得
    while (!this.peekMatch(patternStr) && !this.isAtEnd()) {
      if (this.peekMatch('\n') || this.peekMatch('\r\n')) {
        this.line++;
        this.advance();
      }
      this.advance();
    }
    if (this.isAtEnd()) {
      error(this.line, 'string is not closed.');
      return;
    }
    this.advance(); // 終わりの"をスキップ
    this.addToken(
      TokenType.STRING,
      this.source.slice(this.start + 1, this.current - 1),
      LiteralType.STRING,
    );
  }

  // eslint-disable-next-line class-methods-use-this
  isVarAlphabet(char: string): boolean {
    const charNum: i32 = char.charCodeAt(0);
    if (
      ('a'.charCodeAt(0) <= charNum && charNum <= 'z'.charCodeAt(0)) ||
      ('A'.charCodeAt(0) <= charNum && charNum <= 'Z'.charCodeAt(0)) ||
      '_'.charCodeAt(0) == charNum
    ) {
      return true;
    }
    return false;
  }

  // eslint-disable-next-line class-methods-use-this
  isDigit(char: string): boolean {
    const charNum: i32 = char.charCodeAt(0);
    if ('0'.charCodeAt(0) <= charNum && charNum <= '9'.charCodeAt(0)) {
      return true;
    }
    return false;
  }

  isVarNameElem(char: string): boolean {
    if (this.isDigit(char) || this.isVarAlphabet(char)) {
      return true;
    }
    return false;
  }

  scanNumber(): void {
    let num: string = '';
    while (this.isDigit(this.source.charAt(this.current))) {
      num += this.source.charAt(this.current);
      this.advance();
      if (
        this.source.charAt(this.current).charCodeAt(0) == '_'.charCodeAt(0) &&
        !(this.current + 1 >= this.source.length) &&
        this.isDigit(this.source.charAt(this.current + 1))
      ) {
        this.advance();
      }
    }

    if (this.peekMatch('.') && this.isDigit(this.nextPeek())) {
      num += '.';
      this.advance();

      while (this.isDigit(this.source.charAt(this.current))) {
        num += this.source.charAt(this.current);
        this.advance();
        if (
          this.source.charAt(this.current).charCodeAt(0) == '_'.charCodeAt(0) &&
          !(this.current + 1 >= this.source.length) &&
          this.isDigit(this.source.charAt(this.current + 1))
        ) {
          this.advance();
        }
      }
      this.addToken(TokenType.NUMBER, num, LiteralType.NUMBER);
      // this.addToken(TokenType.FLOAT, num, LiteralType.FLOAT);
      return;
    }
    this.addToken(TokenType.NUMBER, num, LiteralType.NUMBER);
    // this.addToken(TokenType.INT, num, LiteralType.NUMBER);
  }

  scanIdentifier(): void {
    while (this.isVarNameElem(this.peek())) {
      this.advance();
    }
    const text = this.source.slice(this.start, this.current);
    let type: TokenType;

    if (this.keywords.has(text)) {
      type = this.keywords.get(text);
      this.addToken_OnlyType(type);
    } else {
      // 以下を調節
      type = TokenType.IDENTIFIER;
      this.addToken(type, text, LiteralType.NIL);
    }
  }

  scanToken(): void {
    const char: string = this.advance();
    const charNum: u32 = char.charCodeAt(0);
    console.log(`${charNum.toString()} : ${char}`);

    switch (charNum) {
      case '('.charCodeAt(0):
        this.addToken_OnlyType(TokenType.LEFT_PAREN);
        break;
      // other cases
      case ')'.charCodeAt(0):
        this.addToken_OnlyType(TokenType.RIGHT_PAREN);
        break;
      case '{'.charCodeAt(0):
        this.addToken_OnlyType(TokenType.LEFT_BRACE);
        break;
      case '}'.charCodeAt(0):
        this.addToken_OnlyType(TokenType.RIGHT_BRACE);
        break;
      case '['.charCodeAt(0):
        this.addToken_OnlyType(TokenType.LEFT_BRACKET);
        break;
      case ']'.charCodeAt(0):
        this.addToken_OnlyType(TokenType.RIGHT_BRACKET);
        break;
      case ','.charCodeAt(0):
        this.addToken_OnlyType(TokenType.COMMA);
        break;
      case '.'.charCodeAt(0):
        this.addToken_OnlyType(TokenType.DOT);
        break;
      case '-'.charCodeAt(0):
        // if (this.nextMatch('-')) {
        //  this.addToken_OnlyType(TokenType.DECREMENT);
        // } else {
        this.addToken_OnlyType(TokenType.MINUS);
        // }
        break;
      case '+'.charCodeAt(0):
        // if (this.nextMatch('+')) {
        //   this.addToken_OnlyType(TokenType.INCREMENT);
        // } else {
        this.addToken_OnlyType(TokenType.PLUS);
        // }
        break;
      case ';'.charCodeAt(0):
        this.addToken_OnlyType(TokenType.SEMICOLON);
        break;
      case '*'.charCodeAt(0):
        this.addToken_OnlyType(TokenType.STAR);
        break;
      case '%'.charCodeAt(0):
        this.addToken_OnlyType(TokenType.MOD);
        break;
      case '!'.charCodeAt(0):
        if (this.nextMatch('=')) {
          this.addToken_OnlyType(TokenType.BANG);
        } else {
          this.addToken_OnlyType(TokenType.BANG_EQUAL);
        }
        break;
      case '='.charCodeAt(0):
        if (this.nextMatch('=')) {
          this.addToken_OnlyType(TokenType.EQUAL_EQUAL);
        } else {
          this.addToken_OnlyType(TokenType.EQUAL);
        }
        break;
      case '<'.charCodeAt(0):
        if (this.nextMatch('=')) {
          this.addToken_OnlyType(TokenType.LESS_EQUAL);
        } else {
          this.addToken_OnlyType(TokenType.LESS);
        }
        break;
      case '>'.charCodeAt(0):
        if (this.nextMatch('=')) {
          this.addToken_OnlyType(TokenType.GREATER_EQUAL);
        } else {
          this.addToken_OnlyType(TokenType.GREATER);
        }
        break;
      case '/'.charCodeAt(0):
        this.scan_slash_or_comment();
        break;
      case '&'.charCodeAt(0):
        if (this.nextMatch('&')) {
          this.addToken_OnlyType(TokenType.AND);
          break;
        }
        break;
      case '|'.charCodeAt(0):
        if (this.nextMatch('|')) {
          this.addToken_OnlyType(TokenType.OR);
        }
        break;
      case ' '.charCodeAt(0):
      case '\r'.charCodeAt(0):
      case '\t'.charCodeAt(0):
      case '\v'.charCodeAt(0):
      case '\f'.charCodeAt(0):
      case '\u200b'.charCodeAt(0):
      case '\ufeff'.charCodeAt(0):
        break;
      case '\n'.charCodeAt(0):
      case '\r\n'.charCodeAt(0):
        this.line++;
        break;
      case '"'.charCodeAt(0):
        this.scanString('"');
        break;
      case "'".charCodeAt(0):
        this.scanString("'");
        break;

      default:
        if (this.isDigit(char)) {
          this.scanNumber();
        } else if (this.isVarAlphabet(char)) {
          this.scanIdentifier();
        } else {
          error(this.line, 'this charset has no');
        }
    }
  }

  scanTokens(): Array<Token> {
    while (!this.isAtEnd()) {
      this.start = this.current;
      this.scanToken();
    }

    this.tokens.push(
      new Token(TokenType.EOF, '', '', this.line, LiteralType.NIL),
    );
    return this.tokens;
  }
}
