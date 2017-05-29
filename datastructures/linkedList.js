/*
* 链表 Linked List
* Notes: 链表是由一组节点以及它们相互联系的指针组成的线性结构. 
* 单向链表是链表的基本结构, 其中每个节点都有一个指向下一个节点的指针, 沿着指针可遍历所有节点.
* 双向链表有所扩展,每个节点增加了一个指向上一个节点的指针使链表可以被反向遍历
* 链表结构可以被应用于所有一维数组的应用场景,是最擅长插入删除元素的结构. 但是由于不在连续的储存空间, 它不能根据索引随机访问
*/

/*
* 链表节点 LNode
* @property element 节点存放的元素
* @property {LNode} next 下一个节点的指针
*/
class LNode {
  constructor(element) {
    this.element = element;
    this.next = null;
  }
}
/*
* 单向链表 Singly Linked List
* @property {LNode} head 头节点
* @property {Number} length 链表的长度
*/
class SLList {
  constructor() {
    this.head = new LNode('head');  
    this.length = 0;
  }
  /*
  * 向链表插入新元素(在节点或索引的后面插入)
  * @param element 待插入的元素
  * @param pos 插入位置: 节点或索引(可选)
  * @return {Number} 当前链表的长度
  */
  insert(element, pos = this.length - 1) {
    const n = new LNode(element);    
    if (!pos instanceof LNode && typeof pos !== 'number') {
      throw new Error('invalid position param');
    }
    if (this.length === 0) {
      pos = this.head;
    } else if (typeof pos === 'number') {
      if (pos >= this.length) {
        pos = this.length - 1;
      }
      console.log(pos);
      pos = this.get(pos);
    }
    n.next = pos.next;
    pos.next = n;
    this.length++;
    return this.length;
  }
  /*
  * 在链表中查找元素节点
  * @param element 查找的元素
  * @return 找到的节点
  */
  find(element) {
    let curNode = this.head.next;
    while (curNode.element !== element && curNode.next !== null) {
      curNode = curNode.next;
    }
    if (curNode.element === element) {
      return curNode;
    }
    return null;
  }
  /*
  * 按索引在链表中获取元素节点
  * @param idx 节点索引
  * @return 找到的节点
  */
  get(idx) {
    if (idx >= this.length) {
      return null;
    }
    let i = 0;
    let curNode = this.head.next;
    while (i < idx) {
      curNode = curNode.next;
      i++;
    }
    return curNode;
  }
  /*
  * 从链表删除元素
  * @return {Boolean} 是否成功
  */
  remove(element) {
    let curNode = this.head.next;
    let prev = this.head;
    while (curNode.element !== element && curNode.next !== null) {
      prev = curNode;
      curNode = curNode.next;
    }
    console.log(curNode);
    if (curNode.element === element) {
      prev.next = curNode.next;
      this.length--;
      return true;
    }
    return false;
  }
  /*
  * 反转链表
  * @return {Boolean} 是否成功
  */
  reverse() {
    let prev = this.head.next;
    let curNode = prev.next;
    prev.next = null;
    let next;
    while (curNode !== null) {
      next = curNode.next;
      curNode.next = prev;
      prev = curNode;
      curNode = next;
    }
    this.head.next = prev;
    return this;
  }
  /*
  * 显示所有元素
  * @return {String} 包含所有元素的字符串
  */
  showAll() {
    let str = '';
    let curNode = this.head.next;
    let i = 0;
    while (curNode !== null && i < this.length) {
      str = str + ',' + curNode.element;
      curNode = curNode.next;
      i++;
    }
    str = str.substring(1);
    return str;
  }
}

/*
* 示例1
*/
const slLink = new SLList();
slLink.insert(1);  // 1
slLink.insert(2);  // 2
slLink.insert(3, slLink.find(1));  // 3
slLink.insert(4);  // 4
slLink.insert(5);  // 5
slLink.showAll();  // 1,3,2,4,5
slLink.remove(1);  // true
slLink.reverse().showAll();  // 5,4,2,3

/*
* 示例2: 约瑟夫环
* m个人围成一圈,从第一个人开始数1,2,3...,每次数到k的人离开,而后重头开始计数,最后留下来的会是第几个人
* 构造一个环形链表,沿着链表每次删除第k个节点直到只剩下一个节点(不包括head节点)
*/
function countCircle(m, k) {
  const circle = new SLList();
  for (let i = 1; i <= m; i++) {
    circle.insert(i);
  }
  // 将最后一个节点的next指针指向head节点,构成一个环
  circle.find(m).next = circle.head;
  let count = 0;
  let curNode = circle.head.next;
  let next;
  // 最后除了head节点外只能剩下一个节点
  while (curNode.next !== circle.head || curNode !== circle.head.next) {
    if (curNode.element === 'head') {
      curNode = curNode.next;
      continue;
    }
    count++;
    next = curNode.next;
    // 数到k时移除当前节点
    if (count % k === 0) {
      circle.remove(curNode.element);
    }
    curNode = next;
  }
  return curNode.element;
}

countCircle(15, 3);  // 5
