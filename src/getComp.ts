export async function getLine(promptStr: string): Promise<string | null> {
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

export const getArgs = (): string[] => {
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
  console.log(args);
  return args;
};
