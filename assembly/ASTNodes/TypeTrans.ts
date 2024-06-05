import { Token } from '../Token';
import {
  BinaryOperator,
  BinaryOperatorType,
  UnaryOperator,
  UnaryOperatorType,
} from './Operator';

export function transOr(token: Token): BinaryOperator {
  return new BinaryOperator(BinaryOperatorType.OR, token.line);
}
export function transAnd(token: Token): BinaryOperator {
  return new BinaryOperator(BinaryOperatorType.AND, token.line);
}
export function transEqualEqual(token: Token): BinaryOperator {
  return new BinaryOperator(BinaryOperatorType.EQUAL_EQUAL, token.line);
}
export function transBangEqual(token: Token): BinaryOperator {
  return new BinaryOperator(BinaryOperatorType.BANG_EQUAL, token.line);
}
export function transGREATER(token: Token): BinaryOperator {
  return new BinaryOperator(BinaryOperatorType.GREATER, token.line);
}
export function transGreaterEqual(token: Token): BinaryOperator {
  return new BinaryOperator(BinaryOperatorType.GREATER_EQUAL, token.line);
}
export function transLESS(token: Token): BinaryOperator {
  return new BinaryOperator(BinaryOperatorType.LESS, token.line);
}
export function transLessEqual(token: Token): BinaryOperator {
  return new BinaryOperator(BinaryOperatorType.LESS_EQUAL, token.line);
}
export function transPLUS(token: Token): BinaryOperator {
  return new BinaryOperator(BinaryOperatorType.PLUS, token.line);
}
export function transMINUS(token: Token): BinaryOperator {
  return new BinaryOperator(BinaryOperatorType.MINUS, token.line);
}
export function transSTAR(token: Token): BinaryOperator {
  return new BinaryOperator(BinaryOperatorType.STAR, token.line);
}
export function transSLASH(token: Token): BinaryOperator {
  return new BinaryOperator(BinaryOperatorType.SLASH, token.line);
}
export function transMOD(token: Token): BinaryOperator {
  return new BinaryOperator(BinaryOperatorType.MOD, token.line);
}
export function transBANG(token: Token): UnaryOperator {
  return new UnaryOperator(UnaryOperatorType.BANG, token.line);
}
export function transMinusUnary(token: Token): UnaryOperator {
  return new UnaryOperator(UnaryOperatorType.BANG, token.line);
}
