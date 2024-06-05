var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// src/getComp.ts
async function getLine(promptStr) {
  let line = null;
  if (typeof globalThis.prompt === "function") {
    line = prompt(`${promptStr} `);
  } else {
    const readline = await import("node:readline/promises");
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    line = await rl.question(`${promptStr} `);
    rl.close();
  }
  return line;
}
__name(getLine, "getLine");
var getArgs = /* @__PURE__ */ __name(() => {
  let args;
  try {
    const searchParams = new URLSearchParams(window.location.search);
    args = Array.from(searchParams.values());
  } catch {
    args = process.argv;
    args = args.slice(2);
  }
  console.log(args);
  return args;
}, "getArgs");

// build/release.js
async function instantiate(module, imports = {}) {
  const adaptedImports = {
    env: Object.assign(Object.create(globalThis), imports.env || {}, {
      abort(message, fileName, lineNumber, columnNumber) {
        message = __liftString(message >>> 0);
        fileName = __liftString(fileName >>> 0);
        lineNumber = lineNumber >>> 0;
        columnNumber = columnNumber >>> 0;
        (() => {
          throw Error(`${message} in ${fileName}:${lineNumber}:${columnNumber}`);
        })();
      },
      "console.log"(text) {
        text = __liftString(text >>> 0);
        console.log(text);
      },
      "console.error"(text) {
        text = __liftString(text >>> 0);
        console.error(text);
      },
      seed() {
        return (() => {
          return Date.now() * Math.random();
        })();
      }
    })
  };
  const { exports } = await WebAssembly.instantiate(module, adaptedImports);
  const memory2 = exports.memory || imports.env.memory;
  const adaptedExports = Object.setPrototypeOf({
    run(source) {
      source = __lowerString(source) || __notnull();
      exports.run(source);
    }
  }, exports);
  function __liftString(pointer) {
    if (!pointer) return null;
    const end = pointer + new Uint32Array(memory2.buffer)[pointer - 4 >>> 2] >>> 1, memoryU16 = new Uint16Array(memory2.buffer);
    let start = pointer >>> 1, string = "";
    while (end - start > 1024) string += String.fromCharCode(...memoryU16.subarray(start, start += 1024));
    return string + String.fromCharCode(...memoryU16.subarray(start, end));
  }
  __name(__liftString, "__liftString");
  function __lowerString(value) {
    if (value == null) return 0;
    const length = value.length, pointer = exports.__new(length << 1, 2) >>> 0, memoryU16 = new Uint16Array(memory2.buffer);
    for (let i = 0; i < length; ++i) memoryU16[(pointer >>> 1) + i] = value.charCodeAt(i);
    return pointer;
  }
  __name(__lowerString, "__lowerString");
  function __notnull() {
    throw TypeError("value must not be null");
  }
  __name(__notnull, "__notnull");
  return adaptedExports;
}
__name(instantiate, "instantiate");
var {
  memory,
  run
} = await (async (url) => instantiate(
  await (async () => {
    try {
      return await globalThis.WebAssembly.compileStreaming(globalThis.fetch(url));
    } catch {
      return globalThis.WebAssembly.compile(await (await import("node:fs/promises")).readFile(url));
    }
  })(),
  {}
))(new URL("release.wasm", import.meta.url));

// src/coreIndex.ts
async function runFromPath(path) {
  let sourceCode;
  try {
    sourceCode = await globalThis.fetch(path).then((res) => res.text());
  } catch {
    const fs = await import("node:fs/promises");
    sourceCode = await fs.readFile(path, "utf-8");
  }
  try {
    run(sourceCode);
  } catch (err) {
    console.error(`Failed to run file ${path}: ${err}`);
  }
}
__name(runFromPath, "runFromPath");
function runFromString(source) {
  run(source);
}
__name(runFromString, "runFromString");

// src/index.ts
var MainStruct = {
  hadError: false
};
async function runPrompt() {
  const line = await getLine(">>");
  if (line == null || line === "" || line === void 0) {
    console.log(line);
    return;
  }
  runFromString(typeof line === "string" ? line : "");
  MainStruct.hadError = false;
  runPrompt().then(() => {
  }).catch((err) => {
    throw err;
  });
}
__name(runPrompt, "runPrompt");
function main() {
  const args = getArgs();
  try {
    if (args.length > 1) {
      console.log("It's too much args you should use one arg");
    } else if (args.length === 1) {
      runFromPath(args[0]).then(() => {
      }).catch((err) => {
        throw err;
      });
    } else {
      runPrompt().then(() => {
      }).catch((err) => {
        throw err;
      });
    }
  } catch (e) {
    console.log("error");
    throw e;
  }
}
__name(main, "main");
main();
