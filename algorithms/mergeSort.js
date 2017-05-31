/**
 * 归并排序
 * 时间复杂度O(n)
 * @param {Array} arr 待排序的数组
 * @return {Array} 已排序的数组
 */
function mergeSort(arr) {
	const len = arr.length;
	if (len < 2) {
		return arr;
	}
	const mid = Math.floor(len / 2);
	const left = arr.slice(0, mid);
	const right = arr.slice(mid);
	return merge(mergeSort(left), mergeSort(right));
}

/**
 * 合并2个有序数组
 * @param {Array} leftArr 待合并的数组
 * * @param {Array} rightArr 待合并的数组
 * @return {Array} 已排序的数组
 */
function merge(leftArr, rightArr) {
	let arr = [];
	while (leftArr.length > 0 && rightArr.length > 0) {
		if (leftArr[0] <= rightArr[0]) {
			arr.push(leftArr.shift());
		} else {
			arr.push(rightArr.shift());
		}
	}
	if (leftArr.length > 0) {
		arr = arr.concat(leftArr);
	}
	if (rightArr.length > 0) {
		arr = arr.concat(rightArr);
	}
	return arr;
}
