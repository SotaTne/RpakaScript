var __spreadArray =
  (this && this.__spreadArray) ||
  function (to, from, pack) {
    if (pack || arguments.length === 2)
      for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
          if (!ar) ar = Array.prototype.slice.call(from, 0, i);
          ar[i] = from[i];
        }
      }
    return to.concat(ar || Array.prototype.slice.call(from));
  };
var outputs = []; // 出力配列を初期化
function heapSort(arr) {
  outputs.push(__spreadArray([], arr, true)); // 初期状態の配列を出力配列に追加
  var n = arr.length;
  // ヒープ化
  for (var i = Math.floor(n / 2) - 1; i >= 0; i--) {
    heapify(arr, n, i);
  }
  // ヒープから1つずつ取り出してソートする
  for (var i = n - 1; i > 0; i--) {
    // 根ノードと最後の要素を交換
    swap(arr, 0, i);
    // ヒープサイズを1つ減らして、根ノードを適切な位置に移動
    heapify(arr, i, 0);
  }
  return outputs;
}
function heapify(arr, n, i) {
  var largest = i; // 最大値のノードをiに初期化
  var left = 2 * i + 1; // 左の子ノード
  var right = 2 * i + 2; // 右の子ノード
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
function swap(arr, i, j) {
  var temp = arr[i];
  arr[i] = arr[j];
  arr[j] = temp;
  outputs.push(__spreadArray([], arr, true)); // 交換後の配列を出力配列に追加
}
heapSort([1, 4, 3, 5, 2]);
console.log(outputs);
typeof a;
