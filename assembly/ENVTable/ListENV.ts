import ExprObject from '../ExprObject';

export class ListObj {
  uuid: string;

  ListExprs: ExprObject[] = [];

  constructor(ListExprs: ExprObject[], uuid: string) {
    this.uuid = uuid;
    this.ListExprs = ListExprs;
  }
}

export class GlobalList {
  ListMap: Map<string, ListObj> = new Map<string, ListObj>();

  hasId(id: string): boolean {
    let flag = false;
    const keys = this.ListMap.keys();
    for (let i = 0; i < keys.length; i++) {
      if (keys[i] == id) {
        flag = true;
        break;
      }
    }
    return flag;
  }

  getList(id: string): ListObj {
    if (this.ListMap.has(id)) {
      return this.ListMap.get(id);
    }
    throw new Error('has No List');
  }
}
