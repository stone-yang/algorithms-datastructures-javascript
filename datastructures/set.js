/*
* 集合 Set
* Notes: 集合是一种无序的结构,它所包含的元素组成一个类,其中每个元素都是类的成员,特点是不允许同时存在2个相同的元素
*/

/*
* Set
* @property {Array} dataStore 储存元素的空间
* @property {Number} length 队列的长度
*/
class Set {
  constructor() {
    this.dataStore = []; 
    this.length = 0;
  }
  /*
  * 向集合加入元素
  * @param data 待插入的元素
  * @return {Boolean} 是否成功
  */
  add(data) {
    if (this.dataStore.includes(data)) {
      return false;
    }  
    this.dataStore.push(data);
    return true;
  }
  /*
  * 判断元素是否已存在
  * @return {Boolean} 是否存在
  */
  has(data) {
    return this.dataStore.includes(data);
  }
  /*
  * 从集合删除元素
  * @return {Boolean} 是否成功
  */
  remove(data) {
    if (!this.has(data)) {
      return false;
    }
    const idx = this.dataStore.indexOf(data);
    this.dataStore.splice(idx, 1);
    return true;
  }
  /*
  * 获取2个集合的并集
  * @param {Set} set 集合
  * @return {Set} 并集
  */
  union(set) {
    const newSet = new Set();
    for (let item of this.dataStore) {
      newSet.add(item);
    }
    for (let item of set.dataStore) {
      if (!newSet.has(item)) {
        newSet.add(item);
      }
    }
    return newSet;
  }
  /*
  * 获取2个集合的交集
  * @param {Set} set 集合
  * @return {Set} 交集
  */
  intersect(set) {
    const newSet = new Set();
    for (let item of this.dataStore) {
      if (set.has(item)) {
        newSet.add(item);
      }
    }
    return newSet;
  }
  /*
  * 获取2个集合的补集
  * @param {Set} set 补集
  * @return {Set} 补集
  */
  difference(set) {
    const newSet = new Set();
    for (let item of this.dataStore) {
      if (!set.has(item));
        newSet.add(item);
    }
    for (let item of set.dataStore) {
      if (!this.has(item)) {
        newSet.add(item);
      }
    }
    return newSet;
  }
  /*
  * 判断是否属于另一个集合的子集
  * @param {Set} set 集合
  * @return {Boolean}
  */
  subsetOf(set) {
    for (let item of this.dataStore) {
      if (!set.has(item)) {
        return false;
      }
    }
    return true;
  }
  /*
  * 显示所有元素
  * @return {String} 包含所有元素的字符串
  */
  showAll() {
    return `{ ${this.dataStore.join(', ')} }`;
  }
}

/*
* 操作示例
*/
const s1 = new Set();
const s2 = new Set();
s1.add(1);
s1.add(3);
s1.add(5);
s2.add(3);
s2.add(5);
s2.add(7);
s1.union(s2).showAll();  // {1,3,5,7}
s1.intersect(s2).showAll();  // {3,5}
s1.subsetOf(s2);  // false
s1.remove(1); // true
s1.subsetOf(s2);  // true
