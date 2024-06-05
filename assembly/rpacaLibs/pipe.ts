import ExprObject from '../ExprObject';
import LiteralType from '../literalType';
import { Token, TokenType } from '../Token';
import { FuncObj } from './defASfunction';

export function pipeListListNum(input: number[][]) {
  // objectを受け取る
  // オブジェクトの変換
  // 実行
  // オブジェクトを戻して同期
}

const printArgToken = new Token(
  TokenType.IDENTIFIER,
  'obj',
  '',
  -1,
  LiteralType.NIL,
);

const pipeObj: FuncObj = new FuncObj(
  'pipeListListNUM',
  [printArgToken],
  LiteralType.NIL,
);
pipeObj.doBlock = () => {
  searchPipeObj();
  const objectID = pipeObj.tableMap.get('obj');
  searchPipeObj(objectID);
  const Object: ExprObject = getObject(objectID);
  diffObject(objectID);
};
function returnPipeListListNumObj(): FuncObj {
  return pipeObj;
}
