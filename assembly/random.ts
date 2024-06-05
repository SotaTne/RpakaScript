function xorShift128Plus() {
  let x: i64 = 123456789;
  let y: i64 = 362436069;
  let z: i64 = 521288629;
  let w: i64 = 88675123;

  return (): i64 => {
    const t = x ^ (x << 11);
    x = y;
    y = z;
    z = w;
    w = w ^ (w >>> 19) ^ (t ^ (t >>> 8));
    const v: i64 = w;
    return v >>> 0; // 最上位ビットを0にする
  };
}
const rng = xorShift128Plus();

function getRandomIntInclusive(min: i64, max: i64) {
  const range: i64 = max - min;

  let randomBigInt: i64 = rng() % range;
  if (randomBigInt < 0) {
    randomBigInt += range;
  }

  return randomBigInt + min;
}
