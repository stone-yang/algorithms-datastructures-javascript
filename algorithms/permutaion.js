/**
 * 全排列
 * 输出一组无序不重复数字的所有排列方式
 * @param {Array} arr 无序不重复的数组
 * @return {Number} 存在的排列方式数量
 */
const permutation = (function() {
	const stack = [];
	let count = 0;
	function _permutation(arr) {
		if (arr.length === 0) {
			console.log(stack);
			count++;
			return;
		}
		for (let i = 0; i < arr.length; i ++) {
			stack.push(arr[i]);
			const newArr = [...arr];
			newArr.splice(i, 1);
			_permutation(newArr);
			stack.pop();
		}
	}
	return (arr) => {
		_permutation(arr);
		return count;
	};
})();