/**
 * 栈 Stack
 * Notes: 栈是按照后进先出顺序操作元素的线性结构,每次操作只能访问栈顶的元素,不利于排序与检索
 */

/**
 * Stack
 * @property {Array} dataStore 储存元素的空间
 * @property {Number} top 栈顶元素的索引(指向栈顶的后一位)
 * @property {Number} length 栈的长度
 */
class Stack {
  constructor() {
    this.dataStore = []; 
    this.top = 0;  
    this.length = 0;
  }
  /**
   * 向栈顶插入元素
   * @param data 待插入的元素
   * @return {Number} 当前栈的长度
   */
  push(...data) {
    for (let item of data) {
      this.dataStore[this.top++] = item;
      this.length++;
    }   
    return this.length;
  }
  /**
   * 元素出栈
   * @return 出栈的元素
   */
  pop() {
    if (this.top === 0) {
      return null;
    }
    this.length--;
    return this.dataStore[--this.top];
  }
  /**
   * 查看栈顶元素
   * @return 栈顶元素
   */
  peek() {
    return this.top > 0 ? this.dataStore[this.top - 1] : null;
  }
  /**
   * 显示所有元素
   * @return {String} 包含所有元素的字符串
   */
  showAll() {
    let str = '';
    for (let i = 0; i < this.top; i++) {
      str = str + ',' + this.dataStore[i];
    }
    str = str.substring(1);
    return str;
  }
}

/**
 * 操作示例1: 排序
 * 创建2个栈, 一个储存原数据,另一个储存排序数据;
 * 每次对比2个栈的栈顶元素, 如果从原来栈pop出来的元素大于排序栈栈顶的元素则直接进入排序栈;
 * 如果出栈的元素不符合顺序,则将排序栈中不符合顺序的元素搬回原来的栈
 */
const stk = new Stack();
const sortedStk = new Stack();
stk.push(0, 2, 4, 1, 9, 10, 6, 12, 14, 8);  // 10
let e1, e2;
while (stk.length > 0) {  
  e1 = stk.pop();
  e2 = sortedStk.peek();
  if (e1 >= e2 || e2 === null) {
    sortedStk.push(e1);
  } else {
    while (e2 !== null && e1 < e2) {
      stk.push(sortedStk.pop());
      e2 = sortedStk.peek();
    }		
    sortedStk.push(e1);
  }
}
sortedStk.showAll();  // [ 0, 1, 2, 4, 6, 8, 9, 10, 12, 14 ]

/**
 * 操作示例2: 判断字符串的括号是否成对 Justify if a string consists of valid parentheses
 */
const str1 = '43{0}2[[[[5(55)]]]99';
const str2 = '[a, [b, m],[c, [d, j, [k, n]]], e, [f, l]]';
function checkParentheses(str) {
  const pairs = {
    ']': '[',
    ')': '(',
    '}': '{',
  };
  const bracketStk = new Stack();
  str.split('').forEach(s => {
    // 先将所有开括号入栈
    if (/[\[\(\{]/.test(s)) {
      bracketStk.push(s);
    }
    // 匹配上闭合括号以后出栈
    if (/[\]\)\}]/.test(s)) {
      if (pairs[s] === bracketStk.peek()) {
        bracketStk.pop();
      } else {
        return false;
      }
    }
  });
  if (bracketStk.length > 0) {
    return false;
  }
  return true;
}
checkParentheses(str1);  // false
checkParentheses(str2);  // true