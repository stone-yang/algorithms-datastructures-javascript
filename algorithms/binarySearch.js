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
    mid = Math.floor((lowerBound + upperBound) / 2);
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

/**
 * 二分查找(递归写法)
 * 时间复杂度O(logn)
 * @param {Array} arr 被查找的数组
 * @param data 要查找的元素
 * @return {Number} 元素索引值
 */
const binarySearch = (function() {
	let _arr = [];
	let _data = 0;
	function _bs(left, right) {
		if (left > right) {
			return false;
		}
		const mid = Math.floor((left + right) / 2);
		const value = _arr[mid];
		if (value === _data) {
			return mid;
		}
		if (value > _data) {
			return _bs(left, mid - 1);
		}
		if (value < _data) {
			return _bs(mid + 1, right);
		}
	}
	return (arr, data) => {
		_arr = arr;
		_data = data;
		return _bs(0, arr.length - 1);
	};
})();
