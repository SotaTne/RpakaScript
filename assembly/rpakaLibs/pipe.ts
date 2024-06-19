/**
 * Pipeの使い方
 * inJS
 *
 * import Pipe from ~
 *
 * n = Pipe(default_Num,name)
 *
 * inAS
 *
 * Pipeで渡された値を元にオブジェクトを作成
 * nameを元にRpaka内で実行できる変数の作成
 *
 *
 *
 * inRpaka
 *
 *
 *
 * Pipe(ExprObject,name){
 *  この中ではname = ExprObjectとして使われる
 *  stmts()
 *
 * }
 *
 * or Pipe(ExprObject,name) stmt
 *
 */

import ExprObject from '../ExprObject';
import { fromASTransformer } from './tools';

class PipeObject {
  name: string;

  object: ExprObject;

  constructor(name: string, object: ExprObject) {
    this.name = name;
    this.object = object;
  }
}

class Pipe {
  pipes: Map<string, PipeObject> = new Map<string, PipeObject>();

  pushPipe<T>(name: string, object: T): void {
    const useRpakaExpr = fromASTransformer(object);
    const pipeObj = new PipeObject(name, useRpakaExpr);
    this.pipes.set(name, pipeObj);
  }

  endPipe<T>(name: string) {
    return this.pipes.get(name);
  }
}
