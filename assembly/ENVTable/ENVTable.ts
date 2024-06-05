import { runtimeError } from '../errors';
import ExprObject from '../ExprObject';
import { Token } from '../Token';

export function cloneMap<T, R>(baseMap: Map<T, R>): Map<T, R> {
  const clone = new Map<T, R>();
  const keys = baseMap.keys();
  const values = baseMap.values();
  for (let i = 0; i < keys.length; i++) {
    clone.set(keys[i], values[i]);
  }
  return clone;
}

export function getDiff<T, R>(baseMap: Map<T, R>, changedMap: Map<T, R>): void {
  const keys = baseMap.keys();
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    if (changedMap.has(key)) {
      baseMap.set(key, changedMap.get(key));
    }
  }
}

export class ENVIdentifierTable {
  tableMap: Map<string, ExprObject> = new Map<string, ExprObject>();

  defineIdentifier(name: string, object: ExprObject): void {
    this.tableMap.set(name, object);
  }

  hasIdentifier(name: string): boolean {
    if (this.tableMap.has(name)) {
      return true;
    }
    return false;
  }

  getIdentifier(varNameToken: Token): ExprObject {
    // ここでエラーが起こった
    console.log(varNameToken.toString());
    if (this.tableMap.has(varNameToken.lexeme)) {
      console.log(this.tableMap.get(varNameToken.lexeme).value);
      return this.tableMap.get(varNameToken.lexeme);
    }
    // Tokenのlexemeプロパティを使用して文字列を取得し、エラーメッセージに使用
    throw runtimeError(
      varNameToken,
      `Undefined variable '${varNameToken.lexeme}'.`,
    );
  }

  constructor(envTable: Map<string, ExprObject>) {
    this.tableMap = cloneMap(envTable);
  }
}

export class ENVListTable {}
