import Interpreter from './Interpreter/Interpreter';
import Parser from './Parser/Parser';
import { Stmt } from './StmtASTNodes/StmtNode';
import { Token } from './Token';
import { getHadError } from './errors';
import { FuncObj, FuncObjList } from './rpacaLibs/defASfunction';
import returnPrintObj from './rpacaLibs/print';
import Scanner from './scanner';

const funcASObjList: FuncObjList = new FuncObjList();

function setASFun(obj: FuncObj): void {
  funcASObjList.funcList.push(obj);
}

function sets(): void {
  setASFun(returnPrintObj());
}

function run(source: string): void {
  sets();
  const scanner: Scanner = new Scanner(source);
  const tokens: Array<Token> = scanner.scanTokens();
  for (let tokenIndex: i32 = 0; tokenIndex < tokens.length; tokenIndex++) {
    const token = tokens[tokenIndex];
    console.log(token.lexeme);
  }
  console.log(tokens.length.toString());
  const parser: Parser = new Parser(tokens);
  const statements: Stmt[] = parser.parse();
  const interpreter = new Interpreter(funcASObjList);
  console.log('interpret');
  interpreter.interpret(statements);
  // Stop if there was a syntax error.
  if (getHadError()) {
    // eslint-disable-next-line no-useless-return
    return;
  }
}

// eslint-disable-next-line @typescript-eslint/naming-convention
export default function _run(source: string): void {
  run(source);
}
