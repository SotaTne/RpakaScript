import { run } from '../build/release';

export async function runFromPath(path: string): Promise<void> {
  let sourceCode: string;

  // ブラウザ環境ではfetchを使う
  try {
    sourceCode = await globalThis.fetch(path).then((res) => res.text());
  } catch {
    // Node.jsではfs/promisesモジュールを使う
    const fs = await import('node:fs/promises');
    sourceCode = await fs.readFile(path, 'utf-8');
  }

  try {
    run(sourceCode);
  } catch (err: any) {
    console.error(`Failed to run file ${path}: ${err}`);
  }
}

export function runFromString(source: string): void {
  run(source);
}
