# 记那些短小而精悍的JS代码

### Question 1:

实现multiply函数 

``` javascript 
multiply(2)(3) - 1 // 5  
multiply(1)(1)(1) + multiply(5)(5)(5) + multiply(3)(3)(3) === 153  // true  
multiply(1)(2)(3)(4)(5)(6) - multiply(1)(2)(3)(4)(5)  // 600  
```

> **Interpretation:**  
> 1. multiply函数需要每次都返回一个函数才能进行无限次柯里化  
> 2. 对于运算操作符,如果操作数是对象将优先隐式调用对象的valueOf方法.故只需要覆盖valueOf返回累计乘数即可

``` javascript
function multiply(init) {
  let m = init;
  function _multi(n) {
    m *= n;
    return _multi;
  }
  _multi.valueOf = () => m;
  return _multi;
}
```  

### Question 2:  

将深度嵌套的数组转换成一维 flatten nested array  
例如:  

``` javascript
const a = [1,2,[3,4,[5,6],7],8,9,10,[11,12],13,[14]];   
flatten(a);  // [1,2,3,4,5,6,7,8,9,10,11,12,13,14]
```
> **Interpretation:**  
一般递归遍历数组，优先将嵌套最深的元素还原  
<del>解法很多,适合发挥脑洞...</del>  

最标准<del>中规中矩</del>的解法:

``` javascript
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

```
既然要遍历数组,解法怎能少了生成器generator:

``` javascript
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
[...flatten(a)] 
// [1,2,3,4,5,6,7,8,9,10,11,12,13,14]

```
如果数组的每个元素类型一致并且已知,可以利用join方法直接生成一维字符串再解析每个元素:

``` javascript
function flatten(arr) {
  return arr.join(',').split(',').map(n => parseInt(n, 10));
}

```
最后一种写着玩...

``` javascript
const a = [1,2,[3,4,[5,6],7],8,9,10,[11,12],13,[14]];
JSON.stringify(a).replace(/\[|\]/g, '');  
// 1,2,3,4,5,6,7,8,9,10,11,12,13,14

```

### Question 3:
 
简单实现一个debounce函数  
示例:
 
``` javascript 
// 5s内无论调用多少次b函数,a函数都只会被调用一次
const a = () => { console.log('called'); };  
const b = debounce(a, 5000); 
```  

> **Interpretation:**  
> 设置计时器处理函数节流,并且应用闭包记录计时器

``` javascript
function debounce(fn, ms) {
  let timer;
  return function() {
    clearTimeout(timer);
    timer = setTimeout(fn, ms);
  };
}
```  
### Question 4:
 
实现es5的Function.prototype.bind函数

> **Interpretation:**  
> 这里需要特别留意调用函数的方式  
> 复习一下函数调用模式:  
> 1. 函数调用 - fn(a, b)  
> 2. 方法调用 - 函数作为对象的属性调用 obj.fn(a, b)  
> 3. 构造器调用 - 由new操作符调用  new fn(a, b)  
> 4. Apply调用 - 由Function.prototype.apply或Function.prototype.call调用 fn.apply(a, b, c)  

一般很容易想到最简单的实现方法(如下)，可以适用绝大多数情况。但是这种实现并不满足构造器调用的情况。如果要实现更完整的polyfill还需要针对构造器调用进行扩展。

``` javascript
// 简单实现方式(不满足构造器调用的情况)
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
```
引用一段MDN上的polyfill [Function.prototype.bind](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind#Polyfill)  其中，bind函数被调用后返回了一个**fBound**函数。最终调用**fBound**函数时会判断当前的调用模式进而绑定不同的对象。这里的判断是通过加入原型继承的扩展实现的。

``` javascript
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
        	// 关键二: 判断是一般函数调用还是构造器调用
          return fToBind.apply(this instanceof fNOP
                 ? this
                 : oThis,
                 aArgs.concat(Array.prototype.slice.call(arguments)));
        };

    // 关键一: fBound继承了当前调用bind方法的函数
    if (this.prototype) {
      // Function.prototype doesn't have a prototype property
      fNOP.prototype = this.prototype; 
    }
    fBound.prototype = new fNOP();

    return fBound;
  };
}
``` 
**关键一：** 这里表示**fBound**作为构造函数生成的实例继承将继承fNOP，并且继承了**fToBind**（即最初调用Function.prototype.bind的函数）。

``` javascript
if (this.prototype) {
  // Function.prototype doesn't have a prototype property
  fNOP.prototype = this.prototype; 
}
fBound.prototype = new fNOP();
```
**关键二：** 在**fBound**函数内部根据```this instanceof fNOP```判断调用模式。  
如果是一般调用的情况，this的指向可能会是window或者undefined，取决于运行环境（js著名的坑之一）如果是方法调用或apply调用，this将指向一个与fNOP无关的对象。bind函数绑定的对象应该为最初传入Function.prototype.bind的oThis。  
只有在构造器调用的情况下```this instanceof fNOP```判断将通过，此时this指向**fBound**作为构造函数生成的实例，它继承自fNOP。这个实例最终会成为bind函数的绑定对象，之前传入的oThis将被忽略。

### Question 5:  

洗牌: 生成n张牌(编号从1到n),将其打乱顺序

> **Interpretation:**  
1. 生成n张牌的方法很多，这里可以尽量懒一些，不用动不动就去敲loop  
2. 洗牌的思路: 遍历序列，每张与随机一个位置的牌交换

``` javascript
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

```

### Question 6:  

洗牌: 简单实现对象深拷贝

> **Interpretation:**  
一般来说在支持JSON的环境优先通过JSON转换

``` javascript
function deepCopy(obj) {
  if (typeof obj !== 'object') {
    throw new Error('参数不是普通对象或数组,不能完成复制');
  }
  if (JSON) {
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

```

### Question 7:  

用递归实现```sum(1,100000)  // 100001```

> **Interpretation:**  
这里需要尾递归优化才不会栈溢出。然而多数js运行环境并不能默认支持尾递归优化，目前只有在--harmony的严格模式下才能实现

``` javascript
function sum(x, y) {
  'use strict'
  if (y > 0) {
    return sum(x + 1, y - 1);
  } else {
    return x;
  }
}

```
