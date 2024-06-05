import LiteralType from './literalType';

export const enum TokenType {
  // Single-character tokens.
  LEFT_PAREN, // 左括弧: "("
  RIGHT_PAREN, // 右括弧: ")"
  LEFT_BRACE, // 左波括弧: "{"
  RIGHT_BRACE, // 右波括弧: "}"
  LEFT_BRACKET, // 左角括弧: "["
  RIGHT_BRACKET, // 右角括弧: "]"

  COMMA, // カンマ: ","
  DOT, // ドット(ピリオド): "."
  MOD, // モッド: "mod"
  MINUS, // マイナス: "-"
  PLUS, // プラス: "+"
  SEMICOLON, // セミコロン: ";"
  SLASH, // スラッシュ: "/"
  STAR, // アスタリスク: "*"
  // INCREMENT, // インクリメント ++
  // DECREMENT, // デクリメント --

  // One or two character tokens.
  BANG, // 感嘆符: "!"
  BANG_EQUAL, // 不等号: "!="
  EQUAL, // 代入演算子: "="
  EQUAL_EQUAL, // 等価演算子: "=="
  GREATER, // 大なり: ">"
  GREATER_EQUAL, // 以上: ">="
  LESS, // 小なり: "<"
  LESS_EQUAL, // 以下: "<="

  // Literals.
  // FLOAT, // 小数値リテラル
  IDENTIFIER, // 識別子(変数名、関数名など)
  // INT, // 整数値リテラル
  NUMBER, // 数値リテラル
  STRING, // 文字列リテラル

  // Keywords.
  AND, // 論理演算子: "AND"
  // CONTINUE, //その回をスキップする
  BREAK, // ループを抜ける: "BREAK"
  ELSE, // 条件分岐に使う予約語: "ELSE"
  FALSE, // 真理値リテラル: "FALSE"
  FN, // 関数定義に使う予約語: "FN"
  FOR, // ループに使う予約語: "FOR"
  IF, // 条件分岐に使う予約語: "IF"
  NIL, // null値を表すリテラル: "NIL"
  OR, // 論理演算子: "OR"
  // PRINT, // 出力に使う予約語: "PRINT"
  RETURN, // 関数の戻り値に使う予約語: "RETURN"
  // STRUCT, // 構造体定義に使う予約語: "STRUCT"
  TRUE, // 真理値リテラル: "TRUE"
  VAR, // 変数定義に使う予約語: "VAR"
  CONST, // 定数定義に使う予約語: "CONST"
  WHILE, // ループに使う予約語: "WHILE"
  PIPE,
  EOF, // ファイルの終端を表すトークン
}

export class Token {
  type: TokenType;

  lexeme: string;

  literal: string;

  line: i32;

  literalType: LiteralType;

  constructor(
    type: TokenType,
    lexeme: string,
    literal: string,
    line: i32,
    literalType: LiteralType,
  ) {
    this.type = type;
    this.lexeme = lexeme;
    this.literal = literal;
    this.line = line;
    this.literalType = literalType;
  }

  toString(): string {
    return `${this.type.toString()} ${this.lexeme}`; // ${this.literal}`;
  }
}
