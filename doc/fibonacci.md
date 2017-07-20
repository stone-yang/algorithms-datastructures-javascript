# 斐波那契数列的多种解法

### 解法一: 递归

时间复杂度O(2^n)  
这种写法最简洁直观但效率最低

``` javascript 
function fibonacci(n) {
  return n <= 1 ? n : fibonacci(n - 1) + fibonacci(n - 2);
} 
```

### 解法二: 尾递归

时间复杂度O(n)  
不那么直观但是效率高了不少

``` javascript 
function fibonacci(n) {
  if (n <= 1) {
    return n;
  }
  function _f(n, a, b) {
    if (n > 1) {
      [a, b] = [b, a + b];
      return _f(n - 1, a, b);
    } else {
      return b;
    }
  }
  return _f(n, 0, 1);
}
``` 

### 解法三: For Loop 迭代

时间复杂度O(n)  
有点类似动态规划的思路，可以生成整个数列

``` javascript 
function fibonacci(n) {
  const fiboArr = [];
  for (let i = 0; i <= n; i++) {
    if (i <= 1) {
      fiboArr.push(n);
    } else {
      fiboArr.push(fiboArr[i - 1] + fiboArr[i - 2]);
    }
  }
  return fiboArr[n];
}
``` 

### 解法四: Generator 迭代

时间复杂度O(n)  
这种方法效率高也很直观。缺点是只能调用```next()```按顺序生成数列的每一位。如果需要根据索引随机取值则必须先通过iterator接口生成数组， 如```[...fibonacci(3)]  // [0, 1, 1, 2]```

``` javascript 
function* fibonacci(n) {
  let a = 0;
  let b = 1;
  yield a;
  while (n > 0) {
    yield b;
    [a, b] = [b, a + b];
    n--;
  }
}
``` 

### 解法五: Iterator 迭代

时间复杂度O(n)  
原理和用法都类似前面的generator迭代，区别是这里直接实现了iterator接口，整体上变得晦涩了很多，非常不直观。

``` javascript 
function fibonacciIter(n) {
  let a = 0;
  let b = 1;
  let i = 0;
  return {
    [Symbol.iterator]() {
      return {
        next() {
          let value = 0;
          if (i > 0) {
            value = b;
            [a, b] = [b, a + b];
          }
          i++;
          if (i > n) {
            return { done: true };
          }
          return { value };
        }
      };	
    }
  };
}
``` 