import LiteralType from './literalType';

export default class ExprObject {
  constructor(
    public type: LiteralType,
    public value: string,
  ) {}
}
