/**
 * 快速排序(在原数组上排序)
 * 平均时间复杂度O(nlogn)
 * 最好情况O(nlogn),最差情况O(n^2)(在顺序数列的情况下)
 * @param {Array} arr 待排序的数组
 * @return {Array} 已排序的数组(在原数组上排序)
 */
const quickSort = (function() {
  let _arr = [];
  const _qs = (leftStart, rightStart) => {
    if (leftStart >= rightStart) {
      return;
    }
    let left = leftStart;
    let right = rightStart;
    const pivot = _arr[leftStart];
    while (left < right) {
      while (_arr[right] > pivot && left < right) {
        right--;
      }
      while (_arr[left] <= pivot && left < right) {
        left++;
      }
      [_arr[left], _arr[right]] = [_arr[right], _arr[left]];
    }
    _arr[leftStart] = _arr[left];
    _arr[left] = pivot;
    _qs(leftStart, left - 1);
    _qs(right + 1, rightStart);
  };
  return (arr) => {
    _arr = arr;
    _qs(0, arr.length - 1);
    return arr;
  };
})();

/**
 * 快速排序(不在原数组上排序而是返回新数组)
 * @param {Array} arr 待排序的数组
 * @return {Array} 已排序的数组
 */
function quickSort(arr) {
  const leftArr = [];
  const rightArr = [];
  const pivot = arr[0];
  for (let i = 1; i < arr.length; i++) {
    if (arr[i] <= pivot) {
      leftArr.push(arr[i]);
    } else {
      rightArr.push(arr[i]);
    }
  }
  return quickSort(leftArr).concat(pivot, quickSort(rightArr));
}
