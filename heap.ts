/*

const outputs: number[][] = []; // 出力配列を初期化

function heapSort(arr: number[]): number[][] {
  outputs.push([...arr]); // 初期状態の配列を出力配列に追加

  const n = arr.length;

  // ヒープ化
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    heapify(arr, n, i);
  }

  // ヒープから1つずつ取り出してソートする
  for (let i = n - 1; i > 0; i--) {
    // 根ノードと最後の要素を交換
    swap(arr, 0, i);

    // ヒープサイズを1つ減らして、根ノードを適切な位置に移動
    heapify(arr, i, 0);
  }

  return outputs;
}

function heapify(arr: number[], n: number, i: number) {
  let largest = i; // 最大値のノードをiに初期化
  const left = 2 * i + 1; // 左の子ノード
  const right = 2 * i + 2; // 右の子ノード

  // 左の子ノードが親ノードより大きければ、largest を更新
  if (left < n && arr[left] > arr[largest]) {
    largest = left;
  }

  // 右の子ノードが親ノードより大きければ、largest を更新
  if (right < n && arr[right] > arr[largest]) {
    largest = right;
  }

  // largest が親ノードと異なる場合、交換して子ノードに対してヒープ化を行う
  if (largest !== i) {
    swap(arr, i, largest);
    heapify(arr, n, largest);
  }
}

function swap(arr: number[], i: number, j: number) {
  const temp = arr[i];
  arr[i] = arr[j];
  arr[j] = temp;
  outputs.push([...arr]); // 交換後の配列を出力配列に追加
}
heapSort([1, 4, 3, 5, 2]);
console.log(outputs);

*/
