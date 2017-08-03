# 队列 Queue

队列是按照先进先出顺序操作元素的线性结构，一般情况下只能在末尾插入元素，在队首删除元素(和栈相反);
对于优先队列结构，优先级最高的元素将被排在队首，优先级最低的排在队尾。

## 1. 实现

``` javascript 
/**
 * Queue 应用数组实现队列
 * @property {Array} dataStore 储存元素的空间
 * @property {Number} front 队首的索引
 * @property {Number} back 队尾的索引(指向队尾元素的后一位)
 * @property {Number} length 队列的长度
 */
class Queue {
  constructor() {
    this.dataStore = []; 
    this.front = 0;  
    this.back = 0;
    this.length = 0;
  }
  /**
   * 向队尾插入元素
   * @param data 待插入的元素
   * @return {Number} 当前栈的长度
   */
  enqueue(...data) {
    for (let item of data) {
      this.dataStore[this.back++] = item;
      this.length++;
    }   
    return this.length;
  }
  /**
   * 从队首取出元素
   * @return 出栈的元素
   */
  dequeue() {
    if (this.length === 0) {
      return null;
    }
    this.length--;
    return this.dataStore[this.front++];
  }
  /**
   * 显示所有元素
   * @return {String} 包含所有元素的字符串
   */
  showAll() {
    let str = '';
    for (let i = this.front; i < this.back; i++) {
      str = str + ',' + this.dataStore[i];
    }
    str = str.substring(1);
    return str;
  }
}
```

## 2. 双栈队列

实现双栈队列: 用2个栈实现队列的入队出队操作。 Implement enqueue and dequeue operations with two stacks.   
实现方式: 创建一个入队栈和一个出队栈，如果进行出队操作时最先入队的元素在入队栈底，则需要先将元素先压入出队栈再从出队栈顶操作。尽量减少倒栈的频率。

``` javascript 
/**
 * 实现双栈队列: 用2个栈实现队列的入队出队操作 
 * @property {Array} inStack 入队栈
 * @property {Array} outStack 出队栈
 * @property {Number} length 队列的长度
 */
class Queue {
  constructor() {
    this.inStack = [];
    this.outStack = [];
    this.length = 0;
  }
  enqueue(data) {
    this.inStack.push(data);
    this.length++;
  }
  dequeue() {
    if (this.length === 0) {
      return null;
    }
    this.length--;
    if (this.outStack.length === 0) {
      while (this.inStack.length > 1) {
        this.outStack.push(this.inStack.pop());
      }
      return this.inStack.pop();
    }
    return this.outStack.pop();
  }
}
```

## 3. 操作示例

``` javascript 
const q = new Queue();
q.enqueue(10);
q.enqueue(5);
q.enqueue(4);
q.enqueue(8);
q.dequeue();  // 10
```
