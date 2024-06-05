import ExprObject from '../ExprObject';
import LiteralType from '../literalType';

export class ForStateInfo {
  inForStmt: boolean = false;

  constructor(inForStmt: boolean) {
    this.inForStmt = inForStmt;
  }

  isNowFor(): boolean {
    return this.inForStmt;
  }
}

export class BreakStateInfo {
  hasBreak: boolean = false;

  constructor(hasBreak: boolean) {
    this.hasBreak = hasBreak;
  }
}

export class ParseFnStateInfo {
  inFnStmt: boolean = false;

  constructor(inForStmt: boolean) {
    this.inFnStmt = inForStmt;
  }

  isNowFn(): boolean {
    return this.inFnStmt;
  }
}

export class ReturnStateInfo {
  hasReturn: boolean = false;

  ReturnExpr: ExprObject = new ExprObject(LiteralType.NIL, '');

  constructor(hasReturn: boolean) {
    this.hasReturn = hasReturn;
  }
}
