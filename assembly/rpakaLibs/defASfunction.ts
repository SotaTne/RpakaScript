import ExprObject from '../ExprObject';
import LiteralType from '../literalType';

import { cloneMap } from '../ENVTable/ENVTable';
import { Token } from '../Token';

export class FnAsEnv {
  tableMap: Map<string, FuncObj> = new Map<string, FuncObj>();

  defineFn(name: string, object: FuncObj): void {
    this.tableMap.set(name, object);
  }

  hasFn(name: string): boolean {
    if (this.tableMap.has(name)) {
      return true;
    }
    return false;
  }

  getFn(varNameToken: string): FuncObj {
    if (this.tableMap.has(varNameToken)) {
      return this.tableMap.get(varNameToken);
    }
    // Tokenのlexemeプロパティを使用して文字列を取得し、エラーメッセージに使用
    throw new Error(`Undefined function '${varNameToken}'.`);
  }

  constructor(fnTable: Map<string, FuncObj>) {
    this.tableMap = cloneMap(fnTable);
  }
}

export class FuncObj {
  name: string;

  args: Token[];

  returnType: LiteralType;

  tableMap: Map<string, ExprObject> = new Map<string, ExprObject>();

  returnObject: ExprObject = new ExprObject(LiteralType.NIL, '');

  doBlock: () => void = () => {};

  constructor(name: string, args: Token[], returnType: LiteralType) {
    this.name = name;
    this.args = args;
    this.returnType = returnType;
  }
}

export class FuncObjList {
  funcList: FuncObj[] = [];
}
