import esbuild from 'esbuild';
import { copy } from 'esbuild-plugin-copy';

await esbuild.build({
  bundle: true,
  entryPoints: ['./src/index.ts'],
  outdir: './dist',
  platform: 'node',
  target: 'node20',
  plugins: [
    copy({
      assets: [
        {
          from: './build/release.wasm', // コピー元
          to: '.', // コピー先
        },
        {
          from: './build/release.wasm.map', // コピー元
          to: '.', // コピー先
        },
        {
          from: './build/release.wat', // コピー元
          to: '.', // コピー先
        },
        {
          from: './build/release.d.ts', // コピー元
          to: '.', // コピー先
        },
      ],
    }),
  ],
  minify: true,
  format: 'esm', // ESMプロジェクトなので、出力フォーマットを'esm'に設定する必要
});
