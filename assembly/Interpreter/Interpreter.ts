import {
  AssignIdentifier,
  AssignListIdentifier,
  // ArrayLiteral,
  Binary,
  BooleanL,
  CallFn,
  CallList,
  DefList,
  Expr,
  ExprVisitor,
  Grouping,
  NilL,
  NumberL,
  StringL,
  Unary,
  VarIdentifier,
} from '../ASTNodes/ExprNode';
import { BinaryOperatorType, UnaryOperatorType } from '../ASTNodes/Operator';
import { ENVIdentifierTable, getDiff } from '../ENVTable/ENVTable';
import { FnEnv, FnObj } from '../ENVTable/FnENV';
import { GlobalList, ListObj } from '../ENVTable/ListENV';
import { BreakStateInfo, ReturnStateInfo } from '../ENVTable/ParserENV';
import ExprObject from '../ExprObject';
import generateUUID from '../funcs';
import LiteralType from '../literalType';
import { FnAsEnv, FuncObj, FuncObjList } from '../rpakaLibs/defASfunction';
import {
  Block,
  Break,
  FnDefClass,
  ForStmt,
  IfStmt,
  Return,
  Stmt,
  StmtExpr,
  StmtVar,
  StmtVisitor,
  WhileStmt,
} from '../StmtASTNodes/StmtNode';

export const globalList: GlobalList = new GlobalList();

export default class Interpreter
  implements ExprVisitor<ExprObject>, StmtVisitor<void>
{
  baseMap: Map<string, ExprObject> = new Map<string, ExprObject>();

  ENVTable: ENVIdentifierTable = new ENVIdentifierTable(this.baseMap);

  breakStateInfo: BreakStateInfo = new BreakStateInfo(false);

  fnBaseMap: Map<string, FnObj> = new Map<string, FnObj>();

  FnEnvTable: FnEnv = new FnEnv(this.fnBaseMap);

  returnStateInfo: ReturnStateInfo = new ReturnStateInfo(false);

  funcASObjList: FuncObjList;

  fnAsBaseMap: Map<string, FuncObj> = new Map<string, FuncObj>();

  funcASTable: FnAsEnv = new FnAsEnv(this.fnAsBaseMap);

  constructor(funcASObjList: FuncObjList) {
    this.funcASObjList = funcASObjList;
    for (let i = 0; i < this.funcASObjList.funcList.length; i++) {
      const funcName = this.funcASObjList.funcList[i].name;
      const funcASObj: FuncObj = this.funcASObjList.funcList[i];
      this.funcASTable.defineFn(funcName, funcASObj);
    }
  }

  visitBinaryExpr(expr: Binary): ExprObject {
    const left = this.evaluate(expr.left);
    const operator = expr.operator.type;
    const right = this.evaluate(expr.right);

    const leftValue =
      // eslint-disable-next-line no-nested-ternary
      left.type != LiteralType.NUMBER
        ? this.isTruthy(left)
          ? '1'
          : '0'
        : left.value;
    const rightValue =
      // eslint-disable-next-line no-nested-ternary
      right.type != LiteralType.NUMBER
        ? this.isTruthy(right)
          ? '1'
          : '0'
        : right.value;

    switch (operator) {
      case BinaryOperatorType.MINUS:
        return new ExprObject(
          LiteralType.NUMBER,
          (parseFloat(leftValue) - parseFloat(rightValue)).toString(),
        );

      case BinaryOperatorType.PLUS:
        if (
          left.type == LiteralType.STRING &&
          right.type == LiteralType.STRING
        ) {
          return new ExprObject(LiteralType.STRING, left.value + right.value);
        }
        return new ExprObject(
          LiteralType.NUMBER,
          (parseFloat(leftValue) + parseFloat(rightValue)).toString(),
        );
      case BinaryOperatorType.STAR:
        return new ExprObject(
          LiteralType.NUMBER,
          (parseFloat(leftValue) * parseFloat(rightValue)).toString(),
        );
      case BinaryOperatorType.SLASH:
        return new ExprObject(
          LiteralType.NUMBER,
          (parseFloat(leftValue) / parseFloat(rightValue)).toString(),
        );
      case BinaryOperatorType.MOD:
        return new ExprObject(
          LiteralType.NUMBER,
          (parseFloat(leftValue) % parseFloat(rightValue)).toString(),
        );
      case BinaryOperatorType.GREATER:
        return new ExprObject(
          LiteralType.BOOLEAN,
          parseFloat(leftValue) > parseFloat(rightValue) ? '1' : '0',
        );
      case BinaryOperatorType.GREATER_EQUAL:
        return new ExprObject(
          LiteralType.BOOLEAN,
          parseFloat(leftValue) >= parseFloat(rightValue) ? '1' : '0',
        );
      case BinaryOperatorType.LESS:
        return new ExprObject(
          LiteralType.BOOLEAN,
          parseFloat(leftValue) < parseFloat(rightValue) ? '1' : '0',
        );
      case BinaryOperatorType.LESS_EQUAL:
        return new ExprObject(
          LiteralType.BOOLEAN,
          parseFloat(leftValue) <= parseFloat(rightValue) ? '1' : '0',
        );
      case BinaryOperatorType.EQUAL_EQUAL:
        return new ExprObject(
          LiteralType.BOOLEAN,
          this.isEqual(left, right) ? '1' : '0',
        );
      case BinaryOperatorType.BANG_EQUAL:
        return new ExprObject(
          LiteralType.BOOLEAN,
          !this.isEqual(left, right) ? '1' : '0',
        );
      case BinaryOperatorType.AND:
        return new ExprObject(
          LiteralType.BOOLEAN,
          this.isTruthy(left) && this.isTruthy(right) ? '1' : '0',
        );
      case BinaryOperatorType.OR:
        return new ExprObject(
          LiteralType.BOOLEAN,
          this.isTruthy(left) || this.isTruthy(right) ? '1' : '0',
        );
      default:
    }
    return new ExprObject(LiteralType.NIL, '');
  }

  visitUnaryExpr(expr: Unary): ExprObject {
    const operator = expr.operator.type;
    const right = this.evaluate(expr.right);
    switch (operator) {
      case UnaryOperatorType.BANG:
        return new ExprObject(
          LiteralType.BOOLEAN,
          !this.isTruthy(right) ? '1' : '0',
        );
      case UnaryOperatorType.MINUS:
        if (right.type == LiteralType.NUMBER) {
          return new ExprObject(
            LiteralType.NUMBER,
            `-${parseFloat(right.value).toString()}`,
          );
        }
        return new ExprObject(
          LiteralType.NUMBER,
          !this.isTruthy(right) ? '-1' : '0',
        );

      default:
        return new ExprObject(LiteralType.NIL, '');
    }
  }

  visitGroupingExpr(expr: Grouping): ExprObject {
    return this.evaluate(expr.expr);
  }

  visitVarIdentifier(expr: VarIdentifier): ExprObject {
    console.log('Identifier');
    // 関数に存在するか検索
    // 存在したら、StringとしてTokenNameを返す。

    if (
      this.FnEnvTable.hasFn(expr.nameToken.lexeme) ||
      this.funcASTable.hasFn(expr.nameToken.lexeme)
    ) {
      return new ExprObject(LiteralType.STRING, expr.nameToken.lexeme);
    }
    return this.ENVTable.getIdentifier(expr.nameToken);
    // この後実装
  }

  // エラーが起こっている
  visitAssignIdentifier(expr: AssignIdentifier): ExprObject {
    if (this.ENVTable.hasIdentifier(expr.nameToken.lexeme)) {
      this.ENVTable.defineIdentifier(
        expr.nameToken.lexeme,
        this.evaluate(expr.value),
      );
      return this.ENVTable.getIdentifier(expr.nameToken);
    }
    throw new Error('has no Identifier');
  }

  visitCallFn(expr: CallFn): ExprObject {
    console.log('call print');
    const caller = this.evaluate(expr.caller); // 関数名
    const callArgs = expr.args; // 関数の引数
    let returnValue: ExprObject = new ExprObject(LiteralType.NIL, '');
    if (this.FnEnvTable.hasFn(caller.value)) {
      console.log('has fn');
      const funcObj = this.FnEnvTable.getFn(caller.value);
      console.log(`defArgLen: ${funcObj.DefExprNameList.length}`);
      console.log(`setArgLen: ${callArgs.length}`);
      if (callArgs.length == funcObj.DefExprNameList.length) {
        this.returnStateInfo.hasReturn = true;
        // 独自の変数定義を実行する
        const preIdentifierTable: Map<string, ExprObject> =
          this.ENVTable.tableMap;
        {
          // 今回使う変数の環境を生成
          const envIdentifier: ENVIdentifierTable = new ENVIdentifierTable(
            this.ENVTable.tableMap,
          );
          this.ENVTable = envIdentifier;
          const hasReturn = this.returnStateInfo;
          this.returnStateInfo = new ReturnStateInfo(false);
          for (let i = 0; i < funcObj.DefExprNameList.length; i++) {
            const name = funcObj.DefExprNameList[i].lexeme;
            const exprObj = this.evaluate(callArgs[i]);
            if (this.ENVTable.hasIdentifier(name)) {
              throw new Error('already have this var');
            }
            console.log('set Fn');
            this.ENVTable.tableMap.set(name, exprObj);
          } // 新たに変数をセット
          // ブロックの実行
          console.log('runBlock');
          this.execute(funcObj.blockStmt);
          returnValue = this.returnStateInfo.ReturnExpr;
          this.returnStateInfo = hasReturn;
          getDiff(preIdentifierTable, this.ENVTable.tableMap);
        }
        this.ENVTable = new ENVIdentifierTable(preIdentifierTable);
      } else {
        throw new Error('args is too match or less');
      }
    } else if (this.funcASTable.hasFn(caller.value)) {
      console.log(`has ${caller.value}`);
      const funcObj: FuncObj = this.funcASTable.getFn(caller.value);
      if (callArgs.length == funcObj.args.length) {
        for (let i = 0; i < funcObj.args.length; i++) {
          const name = funcObj.args[i].lexeme;
          const exprObj = this.evaluate(callArgs[i]);
          console.log('set Fn');
          funcObj.tableMap.set(name, exprObj);
        }
        funcObj.doBlock();
      }
      return funcObj.returnObject;
    } else {
      throw new Error('has No fn');
    }

    // for(ないのことをじっこうして、stmtを実行する)
    // それをStmtに代入する

    return returnValue;
  }

  visitCallList(expr: CallList): ExprObject {
    const idValue = this.evaluate(expr.callID);
    console.log('idis');
    console.log(idValue.value);

    if (idValue.type == LiteralType.LIST) {
      if (globalList.hasId(idValue.value)) {
        const listObject = globalList.getList(idValue.value);
        const Index = expr.index;
        const index: i32 = parseFloat(this.evaluate(Index).value) as i32;
        if (listObject.ListExprs.length > index) {
          return listObject.ListExprs[index];
        }
        throw new Error('this is over list index');
      } else {
        throw new Error('this list id not define');
      }
    }
    throw new Error('this is not List');
  }

  visitDefList(expr: DefList): ExprObject {
    //
    // idのみを持たせる
    let UUID = generateUUID();

    while (globalList.hasId(UUID)) {
      UUID = generateUUID();
    }

    const exprObjectList: ExprObject[] = [];

    for (let i = 0; i < expr.ExprList.length; i++) {
      console.log('def');
      exprObjectList.push(this.evaluate(expr.ExprList[i]));
    }
    console.log(UUID);

    globalList.ListMap.set(UUID, new ListObj(exprObjectList, UUID));
    // printしやすくするもの
    return new ExprObject(LiteralType.LIST, UUID);
  }

  visitAssignListIdentifier(expr: AssignListIdentifier): ExprObject {
    const idValue = this.evaluate(expr.UUID);
    if (idValue.type == LiteralType.LIST) {
      if (globalList.hasId(idValue.value)) {
        const index = parseFloat(this.evaluate(expr.index).value) as i32;
        for (
          let i = globalList.getList(idValue.value).ListExprs.length;
          i < index;
          i++
        ) {
          globalList.getList(idValue.value).ListExprs[i] = this.evaluate(
            new NilL(''),
          );
        }
        const value = this.evaluate(expr.value);
        globalList.getList(idValue.value).ListExprs[index] = value;
        return value;
      }
      throw new Error('this list is not define');
    } else {
      throw new Error('this is not List');
    }
  }

  private evaluate(expr: Expr): ExprObject {
    return expr.accept<ExprObject>(this);
  }

  private isTruthy(object: ExprObject): boolean {
    if (object.type == LiteralType.BOOLEAN) {
      if (parseFloat(object.value) == 0) return false;
    }
    if (object.type == LiteralType.NIL) return false;
    if (object.type == LiteralType.NUMBER) {
      if (parseFloat(object.value) == 0) {
        return false;
      }
    }
    return true;
  }

  private isEqual(a: ExprObject, b: ExprObject): boolean {
    if (a.type == LiteralType.NIL && b.type == LiteralType.NIL) return true;
    if (a.type == LiteralType.NIL) return false;
    if (a.type == b.type) {
      return a.value == b.value;
    }

    return this.isTruthy(a) == this.isTruthy(b);
  }

  visitNumberLiteral(expr: NumberL): ExprObject {
    console.log(`value:${expr.value}`);
    return new ExprObject(LiteralType.NUMBER, expr.value);
  }

  visitStringLiteral(expr: StringL): ExprObject {
    return new ExprObject(LiteralType.STRING, expr.value);
  }

  visitBooleanLiteral(expr: BooleanL): ExprObject {
    return new ExprObject(LiteralType.BOOLEAN, expr.value);
  }

  visitNilLiteral(expr: NilL): ExprObject {
    return new ExprObject(LiteralType.NIL, expr.value);
  }

  visitErrorExpression(expr: Expr): ExprObject {
    throw new Error('Method not implemented.');
  }

  // Stmt

  visitExprStmt(stmt: StmtExpr): void {
    console.log('ExprStmt');
    this.evaluate(stmt.expr);
  }

  visitVarStmt(stmt: StmtVar): void {
    const value: ExprObject = this.evaluate(stmt.expr);
    if (this.ENVTable.hasIdentifier(stmt.name.lexeme)) {
      throw new Error('already have');
    }
    this.ENVTable.defineIdentifier(stmt.name.lexeme, value);
  }

  visitBlock(block: Block): void {
    this.crateBlock(block.stmts);
  }

  private crateBlock(stmts: Stmt[]): void {
    const preIdentifierTable: Map<string, ExprObject> = this.ENVTable.tableMap;
    const preFnTable: Map<string, FnObj> = this.FnEnvTable.tableMap;
    {
      const envIdentifier: ENVIdentifierTable = new ENVIdentifierTable(
        this.ENVTable.tableMap,
      );
      const envFn: FnEnv = new FnEnv(this.FnEnvTable.tableMap);
      this.ENVTable = envIdentifier;
      this.FnEnvTable = envFn;
      for (let i = 0; i < stmts.length; i++) {
        this.execute(stmts[i]);
        if (this.breakStateInfo.hasBreak || this.returnStateInfo.hasReturn) {
          console.log(`len: ${i}`);
          break;
        }
      }
      getDiff(preIdentifierTable, this.ENVTable.tableMap);
      getDiff(preFnTable, this.FnEnvTable.tableMap);
      // 差分の更新処理
    }
    this.ENVTable = new ENVIdentifierTable(preIdentifierTable);
    this.FnEnvTable = new FnEnv(preFnTable);
  }

  visitIfStmt(stmt: IfStmt): void {
    const preIdentifierTable: Map<string, ExprObject> = this.ENVTable.tableMap;
    {
      const envIdentifier: ENVIdentifierTable = new ENVIdentifierTable(
        this.ENVTable.tableMap,
      );
      this.ENVTable = envIdentifier;
      const boolExprObject: ExprObject = this.evaluate(stmt.boolExpr);
      const ifBool: bool = this.isTruthy(boolExprObject);
      if (ifBool) {
        this.execute(stmt.thenStmt);
      } else {
        this.execute(stmt.elseStmt);
      }
      getDiff(preIdentifierTable, this.ENVTable.tableMap);
    }
    this.ENVTable = new ENVIdentifierTable(preIdentifierTable);
  }

  visitWhileStmt(stmt: WhileStmt): void {
    const preIdentifierTable: Map<string, ExprObject> = this.ENVTable.tableMap;
    {
      const envIdentifier: ENVIdentifierTable = new ENVIdentifierTable(
        this.ENVTable.tableMap,
      );
      this.ENVTable = envIdentifier;
      const hasBreak = this.breakStateInfo;
      this.breakStateInfo = new BreakStateInfo(false);
      const baseBoolExprType = this.evaluate(stmt.boolExpr).type;
      while (
        this.isTruthy(this.evaluate(stmt.boolExpr)) ||
        baseBoolExprType == LiteralType.NIL
      ) {
        this.execute(stmt.whileBlockStmts);
        if (this.breakStateInfo.hasBreak) {
          break;
        }
      }
      this.breakStateInfo = hasBreak;
      getDiff(preIdentifierTable, this.ENVTable.tableMap);
    }
    this.ENVTable = new ENVIdentifierTable(preIdentifierTable);
  }

  visitForStmt(stmt: ForStmt): void {
    const preIdentifierTable: Map<string, ExprObject> = this.ENVTable.tableMap;

    {
      const envIdentifier: ENVIdentifierTable = new ENVIdentifierTable(
        this.ENVTable.tableMap,
      );
      this.ENVTable = envIdentifier;
      const hasBreak = this.breakStateInfo;
      this.breakStateInfo = new BreakStateInfo(false);
      // eslint-disable-next-line no-lone-blocks
      {
        this.execute(stmt.defStmt);
        for (;;) {
          console.log('evalut');
          console.log(this.evaluate(stmt.boolExpr).value.toString());
          const condition = this.evaluate(stmt.boolExpr);
          const baseBoolExprType = condition.type;

          if (
            baseBoolExprType != LiteralType.NIL &&
            !this.isTruthy(this.evaluate(stmt.boolExpr))
          ) {
            break;
          }

          this.execute(stmt.forBlockStmts);
          if (this.breakStateInfo.hasBreak) {
            break;
          }
          // console.log(stmt.endPerBlockStmt);
          this.evaluate(stmt.endPerBlockStmt);
        }
      }
      this.breakStateInfo = hasBreak;
      getDiff(preIdentifierTable, this.ENVTable.tableMap);
    }
    this.ENVTable = new ENVIdentifierTable(preIdentifierTable);
  }

  visitBreak(stmt: Break): void {
    this.breakStateInfo.hasBreak = true;
  }

  visitFnDefClass(stmt: FnDefClass): void {
    // fn a(){}
    // aのネーム+ 内部的なもの

    // 関数名
    // 変数名の配列
    // Stmtの配列
    // 戻り値
    // この4つを関数の定義とする

    const DefExprNamesList = stmt.DefExprNameList;
    const StmtBlock = stmt.blockStmt;
    const FnName = stmt.fnName;

    // はじめに定義しているものを代入する
    if (this.ENVTable.hasIdentifier(FnName.lexeme)) {
      throw new Error('already have this fn');
    }

    // 関数を呼び出す際に必要な最低限のもの
    const fnObj = new FnObj(DefExprNamesList, StmtBlock);
    this.FnEnvTable.defineFn(FnName.lexeme, fnObj);
  }

  visitReturn(stmt: Return): void {
    this.returnStateInfo.ReturnExpr = this.evaluate(stmt.ReturnExpr);
    this.returnStateInfo.hasReturn = true;
    console.log('return');
  }

  private execute(stmt: Stmt): void {
    stmt.accept<void>(this);
  }

  interpret(statements: Stmt[]): void {
    for (let i = 0; i < statements.length; i++) {
      const stmt = statements[i];
      this.execute(stmt);
    }
    // console.log('start');
    // 式を評価し、結果を文字列に変換して返す
    // const value: ExprObject = this.evaluate(expr);
    // console.log(this.stringify(value));
  }
}
