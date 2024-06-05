export default function generateUUID(): string {
  const chars = '0123456789abcdef';
  const uuid: string[] = new Array(36);

  for (let i = 0; i < 36; i++) {
    if (i === 8 || i === 13 || i === 18 || i === 23) {
      uuid[i] = '-';
    } else {
      const rand = Math.floor(Math.random() * 16);
      uuid[i] = chars.charAt(rand as i32);
    }
  }

  uuid[14] = '4'; // 4で固定
  uuid[19] = chars.charAt((Math.floor(Math.random() * 4) + 8) as i32); // 8, 9, a, bのいずれか

  return uuid.join('');
}
