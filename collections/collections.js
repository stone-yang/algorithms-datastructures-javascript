/**
 * Question 1:
 * multiply(2)(3) - 1 // 5
 * multiply(1)(1)(1) + multiply(5)(5)(5) + multiply(3)(3)(3) === 153  // true
 * multiply(1)(2)(3)(4)(5)(6) - multiply(1)(2)(3)(4)(5)  // 600
 * 实现multiply函数
 * Interpretation: 
 * 1. multiply函数需要每次都返回一个函数才能进行无限次柯里化
 * 2. 对于运算操作符,如果操作数是对象将优先隐式调用对象的valueOf方法.故只需要覆盖valueOf返回累计乘数即可
 */
function multiply(init) {
  let m = init;
  function _multi(n) {
    m *= n;
    return _multi;
  }
  _multi.valueOf = () => m;
  return _multi;
}

/**
 * Question 2:
 * 将深度嵌套的数组转换成一维 flatten nested array
 * 例如: const a = [1,2,[3,4,[5,6],7],8,9,10,[11,12],13,[14]];
 * flatten(a);  // [1,2,3,4,5,6,7,8,9,10,11,12,13,14]
 * Interpretation: 
 * 解法很多,适合发挥脑洞...
 */

// 最标准解法
function flatten(arr) {
  let newArr = [];
  for (let item of arr) {
    if (Array.isArray(item)) {
      newArr = newArr.concat(flatten(item));
    } else {
      newArr.push(item);
    }
  }
  return newArr;
}

// 既然要遍历数组,解法怎能少了生成器generator
function* flatten(arr) {
  let newArr = [];
  for (let item of arr) {
    if (Array.isArray(item)) {
      yield* flatten(item);
    } else {
      yield item;
    }
  }
}
[...flatten(a)] // [1,2,3,4,5,6,7,8,9,10,11,12,13,14]

// 如果数组的每个元素类型一致并且已知,可以利用join方法直接生成一维字符串再解析每个元素
function flatten(arr) {
  return arr.join(',').split(',').map(n => parseInt(n, 10));
}

// 最后一种写着玩...
const a = [1,2,[3,4,[5,6],7],8,9,10,[11,12],13,[14]];
JSON.stringify(a).replace(/\[|\]/g, '');  // 1,2,3,4,5,6,7,8,9,10,11,12,13,14

/**
 * Question 3:
 * 简单实现一个debounce函数
 * 示例:
 * const a = () => { console.log('called'); };
 * const b = debounce(a, 5000);
 * 5s内无论调用多少次b函数,a函数都只会被调用一次
 * Interpretation: 
 * 设置计时器处理函数节流,并且应用闭包记录计时器
 */
function debounce(fn, ms) {
  let timer;
  return function() {
    clearTimeout(timer);
    timer = setTimeout(fn, ms);
  };
}

/**
 * Question 4:
 * 实现es5的Function.prototype.bind函数
 * Interpretation: 
 * 这里需要特别留意调用函数的方式
 * 复习一下函数调用模式:
 * 1. 函数调用 - fn(a, b)
 * 2. 方法调用 - 函数作为对象的属性调用 obj.fn(a, b)
 * 3. 构造器调用 - 由new操作符调用  new fn(a, b)
 * 4. Apply调用 - 由Function.prototype.apply或Function.prototype.call调用 fn.apply(a, b, c)
 */

// 一般很容易想到最简单的实现方法,可以适用绝大多数情况,除了构造器调用的情况.如果要实现更完整的polyfill还需要针对构造器调用扩展
if (!Function.prototype.bind) {
  Function.prototype.bind = function(...args1) {
    if (typeof this !== 'function') {
      throw new TypeError('not a function');
    }
    return (...args2) => {
      this.call(...args1.concat(args2));
    };
  }
}

// 引用一段MDN上的polyfill
// 这里加入了原型继承的扩展, 其中fBound是Function.prototype.bind的返回函数. 
// fBound.prototype = new fNOP() 表示fBound继承自fNOP
// 并且在最后fBound中的apply调用时根据this是否指向继承自fNOP的实例来判断当前fBound是一般情况调用还是构造器调用
// 如果是构造器调用,最终apply调用的第一个参数应该是this(即new fBound()生成的实例);
// 如果不是构造器调用,最终apply调用的第一个参数应该是最初传入bind函数的第一个参数(这里是oThis)
if (!Function.prototype.bind) {
  Function.prototype.bind = function(oThis) {
    if (typeof this !== 'function') {
      // closest thing possible to the ECMAScript 5
      // internal IsCallable function
      throw new TypeError('Function.prototype.bind - what is trying to be bound is not callable');
    }

    var aArgs   = Array.prototype.slice.call(arguments, 1),
        fToBind = this,
        fNOP    = function() {},
        fBound  = function() {
          return fToBind.apply(this instanceof fNOP
                 ? this
                 : oThis,
                 aArgs.concat(Array.prototype.slice.call(arguments)));
        };

    if (this.prototype) {
      // Function.prototype doesn't have a prototype property
      fNOP.prototype = this.prototype; 
    }
    fBound.prototype = new fNOP();

    return fBound;
  };
}

/**
 * Question 5:
 * 洗牌: 生成n张牌(编号从1到n),将其打乱顺序
 * Interpretation: 
 * 1. 生成n张牌的方法很多,这里可以尽量懒一些,不用动不动就去敲loop;
 * 2. 洗牌的思路: 遍历序列,每张与随机一个位置的牌交换
 */

function genCards(n) {
  return Array.from({ length: n }, (a, idx) => idx + 1);
}
function shuffle(cards) {
  let k = 0;
  for (let [i, card] of cards.entries()) {
    k = Math.floor(Math.random() * cards.length);
    [cards[i], cards[k]] = [cards[k], cards[i]];
  }
}

/**
 * Question 6:
 * 简单实现对象深拷贝
 * Interpretation: 
 * 一般来说在支持JSON的环境优先用JSON解决(特殊情况有可能很复杂需要具体分析)
 */
function deepCopy(obj) {
  if (typeof obj !== 'object') {
    throw new Error('参数不是普通对象或数组,不能完成复制');
  }
  if (JSON) {
    console.log('support JSON');
    return JSON.parse(JSON.stringify(obj));
  } 
  let newObj = Array.isArray(obj) ? [] : {};
  for (let key of Object.keys(obj)) {
    const value = obj[key];
    if (typeof value === 'object' && value !== null) {
      newObj[key] = deepCopy(obj[key]);
    } else {
      newObj[key] = obj[key];
    }
  }
  return newObj;
}

/**
 * Question 7:
 * 用递归实现sum(1,100000)
 * Interpretation: 
 * 这里需要尾递归优化才不会栈溢出,目前只有在--harmony的严格模式下才能实现
 */
function sum(x, y) {
  'use strict'
  if (y > 0) {
    return sum(x + 1, y - 1);
  } else {
    return x;
  }
}

/**
 * Question 8:
 * 将金额的数字转换成中文大写输出
 */
function formatChnAmount(n) {
  if (!/^\d+\.?\d+$/.test(n)) {
    throw new Error('不是有效金额');
  }
  let str = '';
  let amounts = '零壹贰弎肆伍陆柒捌玖';
  let units = '仟佰拾亿仟佰拾萬仟佰拾元角分';
  let num = Number(n).toFixed(2).replace(/\./, '');
  units = units.substring(units.length - num.length);
  for (let i = 0; i < num.length; i++) {
    str += amounts[num[i]] + units[i];
  }
  return str.replace(/壹拾/g, '拾').replace(/零(仟|佰|拾|角|分)/g, '零').replace(/零+/g, '零')
  .replace(/零(亿|萬|元)/g, '$1').replace(/零$/, '').replace(/元$/, '元整');
}
