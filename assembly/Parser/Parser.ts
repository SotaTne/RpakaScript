import {
  AssignIdentifier,
  AssignListIdentifier,
  Binary,
  BooleanL,
  CallFn,
  CallList,
  DefList,
  Expr,
  Grouping,
  NilL,
  NumberL,
  StringL,
  Unary,
  VarIdentifier,
} from '../ASTNodes/ExprNode';
import { BinaryOperator, UnaryOperator } from '../ASTNodes/Operator';
import {
  transAnd,
  transBANG,
  transBangEqual,
  transEqualEqual,
  transGREATER,
  transGreaterEqual,
  transLESS,
  transLessEqual,
  transMINUS,
  transMinusUnary,
  transMOD,
  transOr,
  transPLUS,
  transSLASH,
  transSTAR,
} from '../ASTNodes/TypeTrans';
import { ForStateInfo, ParseFnStateInfo } from '../ENVTable/ParserENV';
import { ParseError } from '../errors';
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
  WhileStmt,
} from '../StmtASTNodes/StmtNode';
import { Token, TokenType } from '../Token';

export default class Parser {
  private tokens: Token[];

  private current: i32 = 0;

  forStateInfo: ForStateInfo = new ForStateInfo(false);

  parseFnStateInfo: ParseFnStateInfo = new ParseFnStateInfo(false);

  constructor(tokens: Token[]) {
    this.tokens = tokens;
  }

  private match(targetTokenTypes: TokenType[]): boolean {
    for (let i = 0; i < targetTokenTypes.length; i++) {
      if (this.check(targetTokenTypes[i])) {
        this.skipToken(); // current++
        return true;
      }
    }
    return false;
  }

  private check(type: TokenType): boolean {
    // TokenTypeが一致するか
    if (this.isAtEnd()) return false;
    return this.peekToken().type == type;
  }

  private isAtEnd(): boolean {
    // EOFかどうか
    return this.peekToken().type == TokenType.EOF;
  }

  private peekToken(): Token {
    // 現在のcurrentのToken
    return this.tokens[this.current];
  }

  private previousToken(): Token {
    // 現在のcurrentの一つ前のToken
    return this.tokens[this.current - 1];
  }

  private skipToken(): void {
    // currentを一つ飛ばしてTokenを一つ先へ移す
    if (!this.isAtEnd()) this.current++;
  }

  private peekTokenAndAdvance(): Token {
    // 現在のcurrentのTokenを取得し、一つcurrentを進める
    const returnToken = this.peekToken();
    this.skipToken();
    return returnToken;
  }

  private expression(): Expr {
    let expr = this.logicOr();
    if (this.match([TokenType.EQUAL])) {
      if (expr instanceof VarIdentifier) {
        const nameExpr = expr as VarIdentifier;
        expr = this.assignIdentifier(nameExpr);
      }
      if (expr instanceof CallList) {
        const listBaseExpr = expr as CallList;
        expr = this.assignListIdentifier(listBaseExpr);
      }
    }

    return expr;
  }

  private assignIdentifier(nameExpr: VarIdentifier): Expr {
    const name = nameExpr.nameToken;
    const value = this.expression();
    return new AssignIdentifier(name, value);
  }

  private assignListIdentifier(listBaseExpr: CallList): Expr {
    const UUID = listBaseExpr.callID;
    const ListIndex = listBaseExpr.index;
    const value = this.expression();
    return new AssignListIdentifier(UUID, ListIndex, value);
  }

  private logicOr(): Expr {
    let expr: Expr = this.logicAnd();
    // 終端記号まで行くとcurrent+=1されるので何もしなくて良い

    while (this.match([TokenType.OR])) {
      // OR
      // マッチするとcurrent+=1されるので一つ前が正解

      const operator: BinaryOperator = transOr(this.previousToken()); // BinaryOperatorTypeに変換
      const leftExpr: Expr = this.logicAnd();
      expr = new Binary(expr, operator, leftExpr);
    }
    return expr;
  }

  private logicAnd(): Expr {
    // AND
    let expr: Expr = this.equality();
    // 終端記号まで行くとcurrent+=1されるので何もしなくて良い

    while (this.match([TokenType.AND])) {
      // マッチするとcurrent+=1されるので一つ前が正解

      const operator: BinaryOperator = transAnd(this.previousToken()); // BinaryOperatorTypeに変換
      const leftExpr: Expr = this.equality();
      expr = new Binary(expr, operator, leftExpr);
    }
    return expr;
  }

  private equality(): Expr {
    // != と ==
    let expr: Expr = this.comparison();
    // 終端記号まで行くとcurrent+=1されるので何もしなくて良い

    while (this.match([TokenType.EQUAL_EQUAL, TokenType.BANG_EQUAL])) {
      // マッチするとcurrent+=1されるので一つ前が正解
      const operatorToken = this.previousToken();
      let operator: BinaryOperator;
      if (operatorToken.type == TokenType.EQUAL_EQUAL) {
        operator = transEqualEqual(operatorToken);
      } else {
        operator = transBangEqual(operatorToken);
      }
      const leftExpr: Expr = this.comparison();
      expr = new Binary(expr, operator, leftExpr);
    }
    return expr;
  }

  private comparison(): Expr {
    // >= , > , <= , <
    let expr: Expr = this.addition();
    // 終端記号まで行くとcurrent+=1されるので何もしなくて良い

    while (
      this.match([
        TokenType.GREATER,
        TokenType.GREATER_EQUAL,
        TokenType.LESS,
        TokenType.LESS_EQUAL,
      ])
    ) {
      // マッチするとcurrent+=1されるので一つ前が正解
      const operatorToken = this.previousToken();
      let operator: BinaryOperator;
      if (operatorToken.type == TokenType.GREATER) {
        console.log('>');

        operator = transGREATER(operatorToken);
      } else if (operatorToken.type == TokenType.GREATER_EQUAL) {
        operator = transGreaterEqual(operatorToken);
      } else if (operatorToken.type == TokenType.LESS) {
        console.log('<');
        operator = transLESS(operatorToken);
      } else {
        operator = transLessEqual(operatorToken);
      }
      const leftExpr: Expr = this.addition();
      expr = new Binary(expr, operator, leftExpr);
    }
    return expr;
  }

  private addition(): Expr {
    // + と -
    let expr: Expr = this.multiplication();
    // 終端記号まで行くとcurrent+=1されるので何もしなくて良い

    while (this.match([TokenType.PLUS, TokenType.MINUS])) {
      // マッチするとcurrent+=1されるので一つ前が正解
      const operatorToken = this.previousToken();
      let operator: BinaryOperator;
      if (operatorToken.type == TokenType.PLUS) {
        operator = transPLUS(operatorToken);
      } else {
        operator = transMINUS(operatorToken);
      }
      const leftExpr: Expr = this.multiplication();
      expr = new Binary(expr, operator, leftExpr);
    }
    return expr;
  }

  private multiplication(): Expr {
    // * , / , %
    let expr: Expr = this.unary();
    // 終端記号まで行くとcurrent+=1されるので何もしなくて良い

    while (this.match([TokenType.STAR, TokenType.SLASH, TokenType.MOD])) {
      // マッチするとcurrent+=1されるので一つ前が正解
      const operatorToken = this.previousToken();
      let operator: BinaryOperator;
      if (operatorToken.type == TokenType.STAR) {
        operator = transSTAR(operatorToken);
      } else if (operatorToken.type == TokenType.SLASH) {
        operator = transSLASH(operatorToken);
      } else {
        operator = transMOD(operatorToken);
      }
      const leftExpr: Expr = this.unary();
      expr = new Binary(expr, operator, leftExpr);
    }
    return expr;
  }

  private unary(): Expr {
    // !
    if (this.match([TokenType.BANG, TokenType.MINUS])) {
      const operatorToken = this.previousToken();
      let operator: UnaryOperator;
      if (operatorToken.type == TokenType.BANG) {
        operator = transBANG(operatorToken);
      } else {
        operator = transMinusUnary(operatorToken);
      }
      const expr: Expr = this.unary();
      return new Unary(operator, expr);
    }
    return this.caller();
  }

  private caller(): Expr {
    console.log('caller');
    console.log(this.peekToken().toString());

    let expr: Expr = this.callList();
    console.log(this.peekToken().toString());
    for (;;) {
      if (this.match([TokenType.LEFT_PAREN])) {
        console.log('true');
        expr = this.endCall(expr);
      } else {
        console.log('this might');
        console.log('false');
        break;
      }
    }
    return expr;
  }

  private endCall(callee: Expr): Expr {
    const args: Expr[] = [];
    if (!this.check(TokenType.RIGHT_PAREN)) {
      do {
        args.push(this.expression());
      } while (this.match([TokenType.COMMA]) && args.length < 1024);
    }
    this.matchThenTokenElseError(
      TokenType.RIGHT_PAREN,
      "close with ')' after expression",
    );

    console.log('comp');

    return new CallFn(callee, args);
  }

  private callList(): Expr {
    let expr: Expr = this.primary(); // LiteralType.List,uuid
    for (;;) {
      if (this.match([TokenType.LEFT_BRACKET])) {
        console.log('true');
        expr = this.endCallList(expr);
      } else {
        break;
      }
    }
    return expr;
  }

  private endCallList(caller: Expr): Expr {
    let listIndex: Expr = new NilL('');
    if (!this.check(TokenType.RIGHT_BRACKET)) {
      listIndex = this.expression();
      this.matchThenTokenElseError(
        TokenType.RIGHT_BRACKET,
        "close with ']' after expression",
      );
    } else {
      this.matchThenTokenElseError(
        TokenType.RIGHT_BRACKET,
        "close with ']' after expression",
      );
    }
    return new CallList(caller, listIndex);
  }

  private primary(): Expr {
    console.log('primary');
    if (this.match([TokenType.FALSE])) {
      return new BooleanL('0');
    }
    if (this.match([TokenType.TRUE])) {
      return new BooleanL('1');
    }
    if (this.match([TokenType.NUMBER])) {
      console.log('match number');
      console.log(`parseValue:${this.previousToken().lexeme}`);
      return new NumberL(this.previousToken().lexeme);
    }
    if (this.match([TokenType.STRING])) {
      return new StringL(this.previousToken().lexeme);
    }
    if (this.match([TokenType.LEFT_PAREN])) {
      const expr: Expr = this.expression();
      this.matchThenTokenElseError(
        TokenType.RIGHT_PAREN,
        "close with ')' after expression",
      );
      return new Grouping(expr);
    }

    if (this.match([TokenType.IDENTIFIER])) {
      const identifierNameToken = this.previousToken();
      return new VarIdentifier(this.previousToken());
    }

    if (this.match([TokenType.LEFT_BRACKET])) {
      console.log('set list');
      const exprList: Expr[] = [];
      if (!this.check(TokenType.RIGHT_BRACKET)) {
        do {
          exprList.push(this.expression());
        } while (this.match([TokenType.COMMA]));
        console.log('endAr');
        console.log(this.peekToken().toString());
      } else {
        console.log('else');
        console.log(this.peekToken().toString());

        this.matchThenTokenElseError(
          TokenType.RIGHT_BRACKET,
          "close with ']' after expression",
        );
      }
      this.matchThenTokenElseError(
        TokenType.RIGHT_BRACKET,
        "close with ']' after expression",
      );
      console.log(this.peekToken().toString());
      console.log('endlist');

      return new DefList(exprList);
    }

    return new NilL('');
  }

  private matchThenTokenElseError(type: TokenType, message: string): Token {
    if (this.check(type)) {
      return this.peekTokenAndAdvance();
    }
    // 例外処理
    throw new ParseError(message);
  }

  statement(): Stmt {
    if (this.forStateInfo.inForStmt && this.match([TokenType.BREAK])) {
      return this.breakStmt();
    }
    if (this.parseFnStateInfo.inFnStmt && this.match([TokenType.RETURN])) {
      return this.ReturnStmt();
    }
    if (this.match([TokenType.LEFT_BRACE])) {
      return new Block(this.block());
    }
    if (this.match([TokenType.VAR])) return this.varStatement();
    // Varへのマッチ
    if (this.match([TokenType.IF])) return this.ifStatement(); // Ifへのマッチ
    if (this.match([TokenType.FOR])) return this.forStatement();
    if (this.match([TokenType.WHILE])) return this.whileStatement();
    if (this.match([TokenType.FN])) {
      return this.defFnStatement();
    }
    /*
    if (this.match([TokenType.PIPE])) {
      return this.pipeStatement();
    }
    */
    return this.exprStatement();
  }

  private exprStatement(): Stmt {
    const expr: Expr = this.expression();
    console.log('callExpr');
    console.log(this.peekToken().toString());
    this.matchThenTokenElseError(
      TokenType.SEMICOLON,
      "Add ';' after expression.",
    );
    console.log('error is other');
    return new StmtExpr(expr);
  }

  private varStatement(): StmtVar {
    console.log('var Stmt');
    const varNameToken: Token = this.matchThenTokenElseError(
      TokenType.IDENTIFIER,
      'Add Identifier after var',
    );
    let varLeftExpr: Expr = new NilL('');
    if (this.match([TokenType.EQUAL])) {
      varLeftExpr = this.expression();
    }
    console.log('end var');
    console.log(this.peekToken().toString());

    this.matchThenTokenElseError(
      TokenType.SEMICOLON,
      "Add ';' after expression.",
    );
    console.log('end dif');

    return new StmtVar(varNameToken, varLeftExpr);
  }

  private block(): Stmt[] {
    const blockStmts: Stmt[] = [];
    for (;;) {
      if (this.match([TokenType.RIGHT_BRACE])) {
        break;
      }
      if (this.isAtEnd()) {
        this.matchThenTokenElseError(
          TokenType.RIGHT_BRACE,
          "Add '}' after block.",
        );
        break;
      }
      blockStmts.push(this.statement());
    }
    return blockStmts;
  }

  private ifStatement(): IfStmt {
    const ifExpr: Expr = this.expression();
    const thenStmt: Stmt = this.statement();

    let elseStmt: Stmt = new StmtExpr(new NilL(''));
    if (this.match([TokenType.ELSE])) {
      elseStmt = this.statement();
    }
    return new IfStmt(ifExpr, thenStmt, elseStmt);
  }

  private whileStatement(): WhileStmt {
    let boolExpr: Expr = new NilL('');
    if (this.match([TokenType.LEFT_PAREN])) {
      boolExpr = this.expression();
      this.matchThenTokenElseError(
        TokenType.RIGHT_PAREN,
        "close with ')' after expression",
      );
    }

    const inFor = this.forStateInfo;
    this.forStateInfo = new ForStateInfo(true);
    const blockStmts = this.statement();
    this.forStateInfo = inFor;
    return new WhileStmt(boolExpr, blockStmts);
  }

  private forStatement(): ForStmt {
    let defStmt: Stmt = new StmtExpr(new NilL(''));
    let boolExpr: Expr = new NilL('');
    let endPerBlockStmt: Expr = new NilL('');
    if (this.match([TokenType.LEFT_PAREN])) {
      console.log('matchLeftPar');
      console.log(`Now Token${this.peekToken().toString()}`);
      if (!this.match([TokenType.SEMICOLON])) {
        if (this.match([TokenType.VAR])) {
          console.log('matchVAr');

          defStmt = this.varStatement();
        } else {
          console.log('matchExpr');

          defStmt = this.exprStatement();
        }
      }
      if (!this.check(TokenType.SEMICOLON)) {
        console.log('matchNextExpr');

        boolExpr = this.expression();
        console.log(this.previousToken().toString());
        console.log(this.peekToken().toString());
      }
      this.matchThenTokenElseError(
        TokenType.SEMICOLON,
        "close with ';' after expression",
      );
      if (!this.check(TokenType.RIGHT_PAREN)) {
        console.log('finalExpr');
        endPerBlockStmt = this.expression();
      }
      console.log(this.previousToken().toString());
      console.log(this.peekToken().toString());
      this.matchThenTokenElseError(
        TokenType.RIGHT_PAREN,
        "close with ')' after expression",
      );
    }

    const inFor = this.forStateInfo;
    this.forStateInfo = new ForStateInfo(true);
    const blockStmts = this.statement();
    this.forStateInfo = inFor;

    return new ForStmt(defStmt, boolExpr, endPerBlockStmt, blockStmts);
  }

  private breakStmt(): Break {
    this.matchThenTokenElseError(
      TokenType.SEMICOLON,
      "Add ';' after expression.",
    );
    return new Break();
  }

  private defFnStatement(): FnDefClass {
    let BlockStmt: Stmt = new StmtExpr(new NilL(''));

    const name: Token = this.matchThenTokenElseError(
      TokenType.IDENTIFIER,
      'Expect fn name.',
    ); // fn [ident]
    this.matchThenTokenElseError(
      TokenType.LEFT_PAREN,
      "Expect '(' after fn  name.",
    ); // fn ident [(]
    const argNameList: Token[] = [];
    // argList
    const ReturnExpr: Expr = new NilL('');
    if (!this.check(TokenType.RIGHT_PAREN)) {
      // not )
      do {
        if (argNameList.length >= 1024) {
          throw new Error('You have over 1024');
        }
        const argToken = this.matchThenTokenElseError(
          TokenType.IDENTIFIER,
          'Expect parameter name.',
        );
        argNameList.push(argToken);
      } while (this.match([TokenType.COMMA])); // ,がある間
    }
    this.matchThenTokenElseError(
      TokenType.RIGHT_PAREN,
      "Expect ')' after parameter.",
    );

    const inFn = this.parseFnStateInfo;
    this.parseFnStateInfo = new ParseFnStateInfo(true);
    BlockStmt = this.statement();
    this.parseFnStateInfo = inFn;
    return new FnDefClass(name, argNameList, BlockStmt, ReturnExpr);
  }

  private ReturnStmt(): Return {
    let returnExpr: Expr = new NilL('');
    if (!this.match([TokenType.SEMICOLON])) {
      returnExpr = this.expression();
      this.matchThenTokenElseError(
        TokenType.SEMICOLON,
        "Add ';' after expression.",
      );
    }
    return new Return(returnExpr);
  }

  /*
  private pipeStatement(): Pipe {
    if (this.match([TokenType.LEFT_PAREN])) {
      const PipeID = this.expression();
      this.matchThenTokenElseError(
        TokenType.COMMA,
        "Add ',' after expression.",
      );
      const PipeName = this.expression();

      this.matchThenTokenElseError(
        TokenType.RIGHT_PAREN,
        "Add ')' after expression.",
      );
      const stmt = this.statement();
      return new Pipe(pipeID, PipeName, stmt);
    }
    throw new Error('it is not Pipe');
  }
  */

  parse(): Stmt[] {
    const statements: Stmt[] = new Array<Stmt>();
    while (!this.isAtEnd()) {
      statements.push(this.statement());
    }

    return statements;
  }
}
