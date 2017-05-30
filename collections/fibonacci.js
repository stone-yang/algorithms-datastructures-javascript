/**
 * 解法一: 递归
 * 这种写法最简洁直观但效率最低, 时间复杂度O(2^n)
 */
function fibonacci(n) {
  return n <= 1 ? n : fibonacci(n - 1) + fibonacci(n - 2);
}

/**
 * 解法二: 尾递归
 * 不那么直观但是效率高了不少,时间复杂度O(n)
 */
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

/**
 * 解法三: 普通迭代
 * 后3种方法都能生成包含整个数列的数组
 */
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

/**
 * 解法四: generator迭代
 */
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

/**
 * 解法五: iterator迭代
 */
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
