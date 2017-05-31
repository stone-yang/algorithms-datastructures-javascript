/**
 * 数组 Array
 * Notes: 数组是一种有序的线性结构,一般情况下按固定的长度储存,其中每个元素的存储空间是连续的并且类型一致，
 * 故可以通过索引(即元素的偏移量)来随机访问元素。这种结构的插入、删除操作较慢，需要移动后续所有元素。
 * 然而,ECMAScript中的数组与其它多数语言中的数组结构有很大区别。在ECMAScript中,数组被实现成了一种特殊的对象,
 * 相对于其它语言的结构性能较低。它的长度可修改，如果修改了length属性后整个数组的长度也将相应发生改变
 */

/**
 * CustomArray
 * @property {Array} dataStore 储存元素的空间
 * @property {Number} length 数组的指定长度
 * @property {Number} current 当前末尾元素的索引值
 */
class CustomArray {
  constructor(length) {
    this.dataStore = []; 
    this.length = length;
    this.current = -1;   
  }
  /**
   * 判断元素是否还能再插入元素
   * @param {Number} n 待插入的元素的数量
   * @return {Boolean} 是否有空间继续插入元素
   */
  withinLengthLimit(n = 1) {
    return this.current + n <= this.length - 1;
  }
  /**
   * 在末尾插入元素
   * @param data 待插入的元素
   * @return {Boolean} 操作是否成功
   */
  push(...data) {
    if (!this.withinLengthLimit(data.length)) {
      return false;
    }
    for (let item of data) {
      this.dataStore[++this.current] = item;
    }   
    return true;
  }
  /**
   * 在中间插入元素
   * @param {Number} idx 插入索引值
   * @param data 待插入的元素
   * @return {Boolean} 操作是否成功
   */
  insert(idx, data) {
    if (!this.withinLengthLimit()) {
      return false;
    }
    if (idx > this.current + 1) {
      return false;
    }
    let element = this.dataStore[idx];
    this.dataStore[idx] = data;
    this.current++;
    // 向后移动元素
    for (let i = idx + 1; i <= this.current; i++) {
      [this.dataStore[i], element] = [element, this.dataStore[i]];
    }
    return true;
  }
  /**
   * 按索引删除元素
   * @param {Number} idx 索引值
   * @return {Boolean} 操作是否成功
   */
  del(idx) {
    if (idx > this.current) {
      return false;
    }
    this.current--;
    // 向前移动元素
    for (let i = idx; i <= this.current; i++) {
      this.dataStore[i] = this.dataStore[i + 1];
    }
    return true;
  }
  /**
   * 按索引获取元素的值
   * @param {Number} idx 索引值
   * @return 元素的值
   */
  get(idx) {
    return this.dataStore[idx];
  }
  /**
   * 显示所有元素
   * @return {String} 包含所有元素的字符串
   */
  showAll() {
    let str = '';
    this.forEach((element) => {
      str = str + ',' + element;
    });
    str = str.substring(1);
    return str;
  }
  /**
   * 数组反序操作(支持链式调用)
   * @return 实例对象
   */
  reverse() {
    let i = 0;
    let j = 0;
    let mid = Math.floor(this.current / 2)
    for (;i <= mid; i++) {
      j = this.current - i;
      [this.dataStore[i], this.dataStore[j]] = [this.dataStore[j], this.dataStore[i]];
    }
    return this;
  }
  /**
   * 数组排序(支持链式调用)
   * 用快速排序方式实现
   * @param {Function} fn 排序规则 (可选)
   */
  sort(fn) {
    if (fn && typeof fn !== 'function') {
      throw new Error('invalid sorting function');
    }
    if (!fn) {
      fn = (a, b) => { return a - b; };
    }
    const arr = this.dataStore;
    // 快速排序
    function _qs(leftStart, rightStart) {
      if (leftStart >= rightStart) {
        return;
      }
      let left = leftStart;
      let right = rightStart;
      let pivot = arr[leftStart];
      while (left < right) {
        while (fn(pivot, arr[right]) <= 0 && left < right) {
          right--;
        }
        while (fn(arr[left], pivot) <= 0 && left < right) {
          left++;
        }
        [arr[left], arr[right]] = [arr[right], arr[left]]
      }
      arr[leftStart] = arr[left];
      arr[left] = pivot;
      _qs(leftStart, left - 1);
      _qs(right + 1, rightStart);
    }
    _qs(0, this.current);
    return this;
  }
  /**
   * 循环操作
   * @param {Function} fn 操作函数
   */
  forEach(fn) {
    if (!fn) {
      throw new Error('loop function is missing');
    }
    if (fn && typeof fn !== 'function') {
      throw new Error('invalid loop function');
    }
    for (let i = 0; i <= this.current; i++) {
      fn(this.dataStore[i], i);
    }
  }
  /**
   * 根据forEach实现reduce操作
   * @param {Function} fn 操作函数
   * @param init reduce操作的初始值
   * @return reduce操作的结果
   */
  reduce(fn, init) {
    if (!fn) {
      throw new Error('loop function is missing');
    }
    if (fn && typeof fn !== 'function') {
      throw new Error('invalid loop function');
    }
    const hasInit = init !== undefined;
    let reduced = hasInit ? init : this.dataStore[0];
    this.forEach((element, idx) => {
      let e;
      if (hasInit) {
        e = element;
      } else {
        e = this.dataStore[idx + 1];
        if (idx + 1 === this.length) {
          return reduced;
        }
      }
      reduced = fn(reduced, e);
    });
    return reduced;
  }
}

/**
 * 操作示例
 */
const a = new CustomArray(10);
a.push(0, 2, 4, 1, 9, 10, 6, 12, 14);  // true
a.insert(0, 8);  // true
a.push(6);  // false
a.showAll();  // 8,0,2,4,1,9,10,6,12,14
a.reverse().showAll();  // 14,12,6,10,9,1,4,2,0,8
a.sort().forEach((element, idx) => {
  console.log(`${idx} - ${element}`);
});  
// 0 - 0
// 1 - 1
// 2 - 2
// 3 - 4
// 4 - 6
// 5 - 8
// 6 - 9
// 7 - 10
// 8 - 12
// 9 - 14
a.reduce((a, b) => a + b);  // 66
a.reduce((a, b) => a + b, 10);  // 76
