import LiteralType from '../literalType';
import { Token } from '../Token';
import { BinaryOperator, UnaryOperator } from './Operator';

export interface ExprVisitor<T> {
  visitBinaryExpr(expr: Binary): T;
  visitGroupingExpr(expr: Grouping): T;
  visitNumberLiteral(expr: NumberL): T;
  visitStringLiteral(expr: StringL): T;
  visitNilLiteral(expr: NilL): T;
  visitBooleanLiteral(expr: BooleanL): T;
  visitVarIdentifier(expr: VarIdentifier): T;
  visitAssignIdentifier(expr: AssignIdentifier): T;
  visitCallFn(expr: CallFn): T;
  visitDefList(expr: DefList): T;
  visitCallList(expr: CallList): T;
  visitAssignListIdentifier(expr: AssignListIdentifier): T;

  visitUnaryExpr(expr: Unary): T;
  visitErrorExpression(expr: Expr): T;
}
export abstract class Expr {
  abstract accept<T>(visitor: ExprVisitor<T>): T;
}

export abstract class Literal extends Expr {
  value: string;

  valueType: LiteralType;

  constructor(value: string, valueType: LiteralType) {
    super();
    this.value = value;
    this.valueType = valueType;
  }

  abstract accept<R>(visitor: ExprVisitor<R>): R;
}

export class Unary extends Expr {
  accept<T>(visitor: ExprVisitor<T>): T {
    return visitor.visitUnaryExpr(this);
  }

  //! だけ
  operator: UnaryOperator;

  right: Expr;

  constructor(operator: UnaryOperator, right: Expr) {
    super();
    this.right = right;
    this.operator = operator;
  }
}

export class Binary extends Expr {
  left: Expr;

  right: Expr;

  operator: BinaryOperator;

  accept<T>(visitor: ExprVisitor<T>): T {
    return visitor.visitBinaryExpr(this);
  }

  constructor(left: Expr, operator: BinaryOperator, right: Expr) {
    super();
    this.left = left;
    this.right = right;
    this.operator = operator;
  }
}
export class Grouping extends Expr {
  expr: Expr;

  accept<T>(visitor: ExprVisitor<T>): T {
    return visitor.visitGroupingExpr(this);
  }

  constructor(expr: Expr) {
    super();
    this.expr = expr;
  }
}
/*
export class ArrayLiteral extends Expr {
  expr: Expr;

  constructor(exprElements: Expr) {
    super();
    this.expr = exprElements;
  }

  accept<T>(visitor: ExprVisitor<T>): T {
    return visitor.visitArrayLiteral(this);
  }
}
*/

export class VarIdentifier extends Expr {
  nameToken: Token;

  constructor(nameToken: Token) {
    super();
    this.nameToken = nameToken;
  }

  accept<T>(visitor: ExprVisitor<T>): T {
    return visitor.visitVarIdentifier(this);
  }
}
export class AssignIdentifier extends Expr {
  nameToken: Token;

  value: Expr;

  constructor(nameToken: Token, value: Expr) {
    super();
    this.nameToken = nameToken;
    this.value = value;
  }

  accept<T>(visitor: ExprVisitor<T>): T {
    return visitor.visitAssignIdentifier(this);
  }
}

export class CallFn extends Expr {
  caller: Expr;

  args: Expr[];

  constructor(caller: Expr, args: Expr[]) {
    super();
    this.caller = caller;
    this.args = args;
  }

  accept<T>(visitor: ExprVisitor<T>): T {
    return visitor.visitCallFn(this);
  }
}

export class CallList extends Expr {
  callID: Expr;

  index: Expr;

  constructor(callID: Expr, index: Expr) {
    super();
    this.callID = callID;
    this.index = index;
  }

  accept<T>(visitor: ExprVisitor<T>): T {
    return visitor.visitCallList(this);
  }
}

export class DefList extends Expr {
  ExprList: Expr[] = [];

  type: LiteralType = LiteralType.LIST;

  constructor(ExprList: Expr[]) {
    super();
    this.ExprList = ExprList;
  }

  accept<T>(visitor: ExprVisitor<T>): T {
    return visitor.visitDefList(this);
  }
}

export class AssignListIdentifier extends Expr {
  UUID: Expr;

  index: Expr;

  value: Expr;

  constructor(UUID: Expr, index: Expr, value: Expr) {
    super();
    this.UUID = UUID;
    this.index = index;
    this.value = value;
  }

  accept<T>(visitor: ExprVisitor<T>): T {
    return visitor.visitAssignListIdentifier(this);
  }
}

export class NumberL extends Literal {
  value: string;

  valueType: LiteralType = LiteralType.NUMBER;

  constructor(value: string) {
    super(value, LiteralType.NUMBER);
    this.value = value;
  }

  accept<R>(visitor: ExprVisitor<R>): R {
    return visitor.visitNumberLiteral(this);
  }
}

export class StringL extends Literal {
  value: string;

  valueType: LiteralType = LiteralType.STRING;

  constructor(value: string) {
    super(value, LiteralType.STRING);
    this.value = value;
  }

  accept<R>(visitor: ExprVisitor<R>): R {
    return visitor.visitStringLiteral(this);
  }
}

export class NilL extends Literal {
  value: string;

  valueType: LiteralType = LiteralType.NIL;

  constructor(value: string) {
    super(value, LiteralType.NIL);
    this.value = value;
    this.valueType = LiteralType.NIL;
  }

  accept<R>(visitor: ExprVisitor<R>): R {
    return visitor.visitNilLiteral(this);
  }
}

export class BooleanL extends Literal {
  value: string;

  valueType: LiteralType = LiteralType.BOOLEAN;

  constructor(value: string) {
    super(value, LiteralType.BOOLEAN);
    this.value = value;
  }

  accept<R>(visitor: ExprVisitor<R>): R {
    return visitor.visitBooleanLiteral(this);
  }
}

export class ErrorExpr extends Expr {
  constructor(public message: string) {
    super();
  }

  accept<T>(visitor: ExprVisitor<T>): T {
    // エラー処理用の訪問メソッドを追加する必要があります
    return visitor.visitErrorExpression(this);
  }
}
