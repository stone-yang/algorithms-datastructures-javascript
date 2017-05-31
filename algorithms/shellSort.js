/**
 * 希尔排序
 * 不同于基本插入排序只比较相邻的元素, 希尔排序优先归位距离较远的元素.
 * 目的是为了让间隔缩小后的插入排序效率越来越接近最好情况O(n)
 * @param {Array} arr 待排序的数组
 * @return {Array} 已排序的数组
 */
function shellSort(arr) {
  const len = arr.length;
  let gap = 0;
  let temp = 0;
  // 动态定义间隔序列
  while (gap < len / 3) {
    gap = gap * 3 + 1;
  }
  for (; gap > 0; gap = (gap - 1) / 3) {
    for (let i = gap; i < len; i++) {
      temp = arr[i];
      for (let j = i - gap; j >= 0 && arr[j] > temp; j -= gap) {
        arr[j + gap] = arr[j];
        arr[j] = temp;
      }
    }
  }
  return arr;
}