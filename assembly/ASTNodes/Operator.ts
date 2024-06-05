export const enum BinaryOperatorType {
  AND, // 論理演算子: "&&"
  BANG_EQUAL, // 不等号: "!="
  EQUAL_EQUAL, // 等価演算子: "=="
  GREATER, // 大なり: ">"
  GREATER_EQUAL, // 以上: ">="
  LESS, // 小なり: "<"
  LESS_EQUAL, // 以下: "<="
  MOD, // モッド: "mod"
  MINUS, // マイナス: "-"
  OR, // 論理演算子: "||"
  PLUS, // プラス: "+"
  SLASH, // スラッシュ: "/"
  STAR, // アスタリスク: "*"
}
export const enum UnaryOperatorType {
  BANG, // 感嘆符: "!"
  MINUS,
}

export class BinaryOperator {
  line: i32;

  type: BinaryOperatorType;

  constructor(type: BinaryOperatorType, line: i32) {
    this.line = line;
    this.type = type;
  }
}
export class UnaryOperator {
  line: i32;

  type: UnaryOperatorType;

  constructor(type: UnaryOperatorType, line: i32) {
    this.line = line;
    this.type = type;
  }
}
