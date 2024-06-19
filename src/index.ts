import { runFromPath, runFromString } from './coreIndex';

async function getLine(promptStr: string): Promise<string | null> {
  let line: string | null = null;
  if (typeof globalThis.prompt === 'function') {
    line = prompt(`${promptStr} `);
  } else {
    const readline = await import('node:readline/promises');
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    line = await rl.question(`${promptStr} `);
    rl.close();
  }
  return line;
}

const getArgs = (): string[] => {
  let args: string[];
  try {
    // ブラウザ側ではfetch
    const searchParams = new URLSearchParams(window.location.search);
    args = Array.from(searchParams.values());
  } catch {
    // Node.jsではfs/promisesモジュールを使う
    args = process.argv;
    args = args.slice(2);
  }
  return args;
};

const MainStruct = {
  hadError: false,
};

async function runPrompt() {
  const line = await getLine('>>');
  if (line == null || line === '' || line === undefined) {
    console.log(line);
    return; // 終了条件
  }
  runFromString(typeof line === 'string' ? line : '');
  MainStruct.hadError = false;
  // 再帰的に次の入力を待つ
  runPrompt()
    .then(() => {})
    .catch((err) => {
      throw err;
    });
}

function main() {
  const args: string[] = getArgs();
  try {
    if (args.length > 1) {
      console.log("It's too much args you should use one arg");
    } else if (args.length === 1) {
      runFromPath(args[0])
        .then(() => {})
        .catch((err) => {
          throw err;
        });
    } else {
      runPrompt()
        .then(() => {})
        .catch((err) => {
          throw err;
        });
    }
  } catch (e) {
    console.log('error');
    throw e;
  }
}

main();
