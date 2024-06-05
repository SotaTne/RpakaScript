import { Stmt } from '../StmtASTNodes/StmtNode';
import { Token } from '../Token';
import { cloneMap } from './ENVTable';

export class FnObj {
  DefExprNameList: Token[];

  blockStmt: Stmt;

  constructor(DefExprNameList: Token[], blockStmt: Stmt) {
    this.DefExprNameList = DefExprNameList;
    this.blockStmt = blockStmt;
  }
}

export class FnEnv {
  tableMap: Map<string, FnObj> = new Map<string, FnObj>();

  defineFn(name: string, object: FnObj): void {
    this.tableMap.set(name, object);
  }

  hasFn(name: string): boolean {
    if (this.tableMap.has(name)) {
      return true;
    }
    return false;
  }

  getFn(varNameToken: string): FnObj {
    if (this.tableMap.has(varNameToken)) {
      return this.tableMap.get(varNameToken);
    }
    // Tokenのlexemeプロパティを使用して文字列を取得し、エラーメッセージに使用
    throw new Error(`Undefined function '${varNameToken}'.`);
  }

  constructor(fnTable: Map<string, FnObj>) {
    this.tableMap = cloneMap(fnTable);
  }
}
