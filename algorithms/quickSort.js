/**
 * 快速排序
 * 平均时间复杂度O(nlogn)
 * 最好情况O(nlogn),最差情况O(n^2)(在顺序数列的情况下)
 * @param {Array} arr 待排序的数组
 * @return {Array} 已排序的数组(在原数组上排序)
 */
function quickSort(arr) {
  function _qs(leftStart, rightStart) {
    if (leftStart >= rightStart) {
      return;
    }
    let left = leftStart;
    let right = rightStart;
    let pivot = arr[leftStart];
    while (left < right) {
      while (arr[right] >= pivot && left < right) {
        right--;
      }
      while (arr[left] <= pivot && left < right) {
        left++;
      }
      [arr[left], arr[right]] = [arr[right], arr[left]]
    }
    arr[leftStart] = arr[left];
    arr[left] = pivot;
    _qs(leftStart, left - 1);
    _qs(right + 1, rightStart);
  }
  _qs(0, arr.length - 1);
  return arr;
}

/**
 * 快速排序(不在原数组上排序)
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
