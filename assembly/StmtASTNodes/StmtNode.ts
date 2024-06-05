import { Expr } from '../ASTNodes/ExprNode';
import { Token } from '../Token';

export interface StmtVisitor<T> {
  visitBlock(stmt: Block): T;
  visitExprStmt(stmt: StmtExpr): T;
  visitVarStmt(stmt: StmtVar): T;
  visitIfStmt(stmt: IfStmt): T;
  visitForStmt(stmt: ForStmt): T;
  visitWhileStmt(stmt: WhileStmt): T;
  visitBreak(stmt: Break): T;
  visitFnDefClass(stmt: FnDefClass): T;
  visitReturn(stmt: Return): T;
}

export abstract class Stmt {
  abstract accept<T>(visitor: StmtVisitor<T>): T;
}

export class StmtExpr extends Stmt {
  expr: Expr;

  accept<T>(visitor: StmtVisitor<T>): T {
    return visitor.visitExprStmt(this);
  }

  constructor(expr: Expr) {
    super();
    this.expr = expr;
  }
}

export class StmtVar extends Stmt {
  public name: Token;

  expr: Expr;

  accept<T>(visitor: StmtVisitor<T>): T {
    return visitor.visitVarStmt(this);
  }

  constructor(name: Token, expr: Expr) {
    super();
    this.name = name;
    this.expr = expr;
  }
}

export class Block extends Stmt {
  stmts: Stmt[];

  constructor(stmts: Stmt[]) {
    super();
    this.stmts = stmts;
  }

  accept<T>(visitor: StmtVisitor<T>): T {
    return visitor.visitBlock(this);
  }
}

export class IfStmt extends Stmt {
  boolExpr: Expr;

  thenStmt: Stmt;

  elseStmt: Stmt;

  constructor(boolExpr: Expr, thenStmt: Stmt, elseStmt: Stmt) {
    super();
    this.boolExpr = boolExpr;
    this.thenStmt = thenStmt;
    this.elseStmt = elseStmt;
  }

  accept<T>(visitor: StmtVisitor<T>): T {
    return visitor.visitIfStmt(this);
  }
}
export class WhileStmt extends Stmt {
  boolExpr: Expr;

  whileBlockStmts: Stmt;

  constructor(
    boolExpr: Expr,

    whileBlockStmts: Stmt,
  ) {
    super();

    this.boolExpr = boolExpr;

    this.whileBlockStmts = whileBlockStmts;
  }

  accept<T>(visitor: StmtVisitor<T>): T {
    return visitor.visitWhileStmt(this);
  }
}
export class ForStmt extends Stmt {
  defStmt: Stmt;

  boolExpr: Expr;

  endPerBlockStmt: Expr;

  forBlockStmts: Stmt;

  constructor(
    defStmt: Stmt,

    boolExpr: Expr,

    endPerBlockStmt: Expr,
    forBlockStmts: Stmt,
  ) {
    super();
    this.defStmt = defStmt;

    this.boolExpr = boolExpr;

    this.endPerBlockStmt = endPerBlockStmt;
    this.forBlockStmts = forBlockStmts;
  }

  accept<T>(visitor: StmtVisitor<T>): T {
    return visitor.visitForStmt(this);
  }
}

/*
export class DefFn extends Stmt {
  name: Token;

  fnBlockStmts: Stmt[] = [];

  fnDefExprNames: Token[] = [];

  fnDefaultExprs: Expr[] = [];

  constructor(
    name: Token,
    fnDefExprNames: Token[],
    fnDefaultExprs: Expr[],
    fnBlockStmts: Stmt[],
  ) {
    super();
    this.name = name;
    this.fnBlockStmts = fnBlockStmts;
    this.fnDefaultExprs = fnDefaultExprs;
    this.fnDefExprNames = fnDefExprNames;
  }

  accept<T>(visitor: StmtVisitor<T>): T {
    return visitor.visitDefFn(this);
  }
}
*/
export class Break extends Stmt {
  accept<T>(visitor: StmtVisitor<T>): T {
    return visitor.visitBreak(this);
  }
}

export class FnDefClass extends Stmt {
  fnName: Token;

  DefExprNameList: Token[];

  blockStmt: Stmt;

  returnExpr: Expr;

  constructor(
    fnName: Token,
    DefExprNameList: Token[],

    stmts: Stmt,

    returnExpr: Expr,
  ) {
    super();
    this.fnName = fnName;
    this.DefExprNameList = DefExprNameList;
    this.blockStmt = stmts;
    this.returnExpr = returnExpr;
  }

  accept<T>(visitor: StmtVisitor<T>): T {
    return visitor.visitFnDefClass(this);
  }
}

export class Return extends Stmt {
  ReturnExpr: Expr;

  constructor(ReturnExpr: Expr) {
    super();
    this.ReturnExpr = ReturnExpr;
  }

  accept<T>(visitor: StmtVisitor<T>): T {
    return visitor.visitReturn(this);
  }
}
