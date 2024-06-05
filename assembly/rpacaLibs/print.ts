import LiteralType from '../literalType';
import { Token, TokenType } from '../Token';
import { FuncObj } from './defASfunction';
import { stringify } from './tools';

const printArgToken = new Token(
  TokenType.IDENTIFIER,
  'printArg',
  '',
  -1,
  LiteralType.NIL,
);

const printObj: FuncObj = new FuncObj(
  'print',
  [printArgToken],
  LiteralType.NIL,
);
printObj.doBlock = () => {
  console.log('console');
  console.log(stringify(printObj.tableMap.get('printArg')));
};
export default function returnPrintObj(): FuncObj {
  return printObj;
}
