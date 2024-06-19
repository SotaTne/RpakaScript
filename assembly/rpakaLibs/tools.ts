import { ListObj } from '../ENVTable/ListENV';
import ExprObject from '../ExprObject';
import generateUUID from '../funcs';
import { globalList } from '../Interpreter/Interpreter';
import LiteralType from '../literalType';

export function stringify(object: ExprObject): string {
  if (object.type == LiteralType.NIL) return 'nil';
  if (object.type == LiteralType.BOOLEAN) {
    if (object.value == '0') return 'false';
    return 'true';
  }
  if (object.type == LiteralType.LIST) {
    let outPut = '[';
    const lists = globalList.getList(object.value);
    if (lists.ListExprs.length > 0) {
      for (let i = 0; i < lists.ListExprs.length - 1; i++) {
        outPut += `${stringify(lists.ListExprs[i])},`;
      }
      outPut += stringify(lists.ListExprs[lists.ListExprs.length - 1]);
    }
    outPut += ']';

    // string
    // number
    return outPut;
  }
  console.log(object.value);
  return object.value;
}

export function isTruthy(object: ExprObject): boolean {
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

export function toNumber(object: ExprObject): f64 {
  const leftValue: f64 = parseFloat(
    // eslint-disable-next-line no-nested-ternary
    object.type != LiteralType.NUMBER
      ? isTruthy(object)
        ? '1'
        : '0'
      : object.value,
  );
  return leftValue;
}
/*
export function toList(object: ExprObject): {
  
}
*/

export function fromASTransformer<T>(inputValue: T): ExprObject {
  let value: string = '';
  let type: LiteralType = LiteralType.NIL;
  if (typeof inputValue == 'undefined') {
    type = LiteralType.NIL;
    value = '';
  }
  if (typeof inputValue == 'number') {
    type = LiteralType.NUMBER;
    if (typeof inputValue == 'number') {
      value = inputValue.toString();
    }
  }
  if (typeof inputValue == 'boolean') {
    type = LiteralType.BOOLEAN;
    value = inputValue ? '1' : '0';
  }
  if (typeof inputValue == 'string') {
    type = LiteralType.STRING;
    value = inputValue.toString();
  }
  if (typeof inputValue == 'object') {
    if (inputValue instanceof Array) {
      let UUID = generateUUID();
      while (globalList.hasId(UUID)) {
        UUID = generateUUID();
      }
      type = LiteralType.LIST;
      value = UUID;
      if (inputValue.length == 0) {
        globalList.ListMap.set(
          UUID,
          new ListObj([new ExprObject(LiteralType.NIL, '')], UUID),
        );
      } else {
        const ObjectList: ExprObject[] = [];
        for (let i = 0; i < inputValue.length; i++) {
          ObjectList.push(fromASTransformer(inputValue[i]));
        }
        globalList.ListMap.set(UUID, new ListObj(ObjectList, UUID));
      }
    }
  }
  return new ExprObject(type, value);
  // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
}
// 型変換関数
export function fromRpacaTransformerNumber(inputValue: ExprObject): f64 {
  if (inputValue.type == LiteralType.NUMBER) {
    return parseFloat(inputValue.value) as f64;
  }
  return 0;
}
export function fromRpacaTransformerString(inputValue: ExprObject): string {
  if (inputValue.type == LiteralType.NUMBER) {
    return inputValue.value.toString() as string;
  }
  return '';
}
export function fromRpacaTransformerBoolean(inputValue: ExprObject): boolean {
  if (inputValue.type == LiteralType.BOOLEAN) {
    return inputValue.value != '0';
  }
  return false;
}
export function fromRpacaTransFormerAll<T>(inputValue: ExprObject): T {
  if (inputValue.type == LiteralType.NUMBER) {
    return parseFloat(inputValue.value) as T;
  }
  if (inputValue.type == LiteralType.BOOLEAN) {
    if (inputValue.value == '1') {
      return true as T;
    }
    return false as T;
  }
  if (inputValue.type == LiteralType.STRING) {
    return inputValue.value as T;
  }
  if (inputValue.type == LiteralType.LIST) {
    const returnList = [];
    let returnType: LiteralType;
    const baseExprList = globalList.ListMap.get(inputValue.value).ListExprs;
    if (baseExprList.length == 0) {
      returnType = LiteralType.NIL;
      returnList.push(null);
    }
    returnType = baseExprList[0].type;
    returnList.push(fromRpacaTransFormerAll(baseExprList[0]));
    for (let i = 1; i < baseExprList.length; i++) {
      if (baseExprList[i].type == returnType) {
        returnList.push(fromRpacaTransFormerAll(baseExprList[i]));
      } else {
        let pushValue = null;
        switch (returnType) {
          case LiteralType.BOOLEAN:
            break;
          case LiteralType.NUMBER:
            break;
          case LiteralType.STRING:
            break;
          case LiteralType.LIST:
            break;
          default:
            pushValue = null;
        }
      }
    }
    fromRpacaTransFormerAll(
      globalList.ListMap.get(inputValue.value).ListExprs[0],
    );
    return returnList as T;
  }
  return null as T;
}
export function fromRpacaTransformerListNum(
  inputValue: ExprObject,
): Array<number> {
  if (inputValue.type == LiteralType.LIST) {
    const returnList: f64[] = [];
    const useList = globalList.getList(inputValue.value);
    if (useList && useList.ListExprs.length != 0) {
      const Type = LiteralType.NUMBER;

      for (let i = 0; i < useList.ListExprs.length; i++) {
        let value: f64 = 0;
        const valueObject = new ExprObject(Type, useList.ListExprs[i].value);
        if (Type == LiteralType.NUMBER) {
          value = fromRpacaTransformerNumber(valueObject) as f64;
        }
        returnList.push(value as f64);
      }
    }
    return returnList;
  }
  return [];
}
export function fromRpacaTransformerListListNum(
  inputValue: ExprObject,
): Array<Array<f64>> {
  if (inputValue.type == LiteralType.LIST) {
    const returnList: f64[][] = [];
    const useList = globalList.getList(inputValue.value);
    if (useList && useList.ListExprs.length != 0) {
      const Type = LiteralType.LIST;

      for (let i = 0; i < useList.ListExprs.length; i++) {
        let value: f64[] = [];
        const valueObject = new ExprObject(Type, useList.ListExprs[i].value);
        if (Type == LiteralType.LIST) {
          value = fromRpacaTransformerListNum(valueObject);
        }
        returnList.push(value as f64[]);
      }
    }
    return returnList;
  }
  return [[]];
}
