/**
 * 二分查找
 * 时间复杂度O(logn)
 * @param {Array} arr 被查找的数组
 * @param data 要查找的元素
 * @return {Number} 元素索引值
 */
function binarySearch(arr, data) {
  let lowerBound = 0;
  let upperBound = arr.length - 1;
  let mid = 0;
  while (lowerBound <= upperBound) {
    mid = Math.floor(lowerBound + upperBound) / 2;
    if (arr[mid] === data) {
      return mid;
    }
    if (arr[mid] > data) {
      upperBound = mid - 1;
    }
    if (arr[mid] < data) {
      lowerBound = mid + 1;
    }
  }
  return -1;
}