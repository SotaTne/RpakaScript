// The entry file of your WebAssembly module.
// import { _run } from "./compiler/core";

import _run from './core';

export default function run(source: string): void {
  // TestTrans();
  _run(source);
}
