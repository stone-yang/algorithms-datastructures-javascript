# 异步流程控制 - Lazyman

### 问题描述:

实现一个除了吃就知道睡的LazyMan，可以按照以下方式调用：  

``` javascript
LazyMan('Hank');
// Hi! This is Hank!

LazyMan('Hank').sleep(10).eat('dinner');
// Hi! This is Hank!
// (等待10秒...)
// Wake up after 10
// Eat dinner~

LazyMan('Hank').eat('dinner').eat('supper');
// Hi! This is Hank!
// Eat dinner~
// Eat supper~

LazyMan('Hank').sleepFirst(5).eat('supper')输出
// (等待5秒...)
// Wake up after 5
// Hi This is Hank!
// Eat supper~

以此类推。
题目出处: 微信前端团队
 
```

### 切入点分析:  
* ***面向对象的设计：*** 需要注意的是LazyMan的构造函数不是由new操作符调用的。也就是说，其实现方式看起来更倾向于工厂模式，而不是常见的构造函数模式。如果需要釆用构造函数原型模式来实现至少要外部封装一层。
* ***异步流程控制：*** 这是本文的重点。在链式调用中执行sleep方法能够暂停任意时间。也就是说，这种链式调用能实现以同步的写法依次调用一系列异步操作。
* ***任务队列：*** 被链式调用的方法是有优先级的。sleepFirst方法最特殊，它的调用在其它所有方法之前。因此，可以将这些被调用的方法看做是一个个任务，创建一个任务队列来控制优先级。

## 方法一: 用promise实现

将每个任务记录为Promise构造函数的参数，执行任务队列时为每个任务创建一个promise。  
对于简单的场景用promise实现看起来最简洁, 但是如果涉及到每个任务都有返回值的时候就不如generator或者async直观了  

``` javascript
function LazyMan(name) {
  /**
   * @property {String} name 名字
   * @property {Array} tasks 任务队列: 其中任务的结构为Promise构造函数的参数
   */
  class _Lazyman {
    constructor(name) {
      this.name = name;
      this.tasks = [];
      this.tasks.push((resolve) => {
        console.log(`Hi! This is ${this.name}!`);
        resolve();    
      });
      // 在本轮事件循环结束时开始执行任务, 优先级相当于node环境的process.nextTick,
      // 相较于setTimeout之类的方法(把任务加到事件主循环)优先级高得多
      let pTasks = Promise.resolve().then(() => {
        for (let task of this.tasks) {
          pTasks = pTasks.then(() => new Promise(task));
        }
      });
      // 这里还可以用async实现, 详见方法三
    }
    sleep(secs) {
      // 这里需要通过闭包来记录每个任务的参数
      this.tasks.push((function(secs) {
        return (resolve) => {
          setTimeout(() => {
            console.log(`Wake up after ${secs}!`);
            resolve();  
          }, secs * 1000);
        };
      })(secs));
      return this;
    }
    sleepFirst(secs) {
      this.tasks.unshift((function(secs) {
        return (resolve) => {
          setTimeout(() => {
            console.log(`Wake up after ${secs}!`);
            resolve();  
          }, secs * 1000);
        };
      })(secs));
      return this;
    }
    eat(meal) {
      this.tasks.push((function(meal) {
        return (resolve) => {
          console.log(`eat ${meal}~`);
          resolve();  
        };
      })(meal));
      return this;
    }
  }
  return new _Lazyman(name);
}
```

## 方法二: 用generator实现

每个任务记录为以next函数为参数的普通函数，next函数表示将执行权交还给iterator，进而再继续下一个任务。

``` javascript
function LazyMan(name) {
  class _Lazyman {
    constructor(name) {
      this.name = name;
      this.tasks = [];
      this.tasks.push((next) => {
        console.log(`Hi! This is ${this.name}!`);
        next();    
      });
      const self = this;
      // 在下一轮事件循环开始执行任务队列
      setTimeout(() => {
        const taskIter = (function*() {
          for (let task of self.tasks) {
            yield task;
          }
        })();
        const next = () => {
          const res = taskIter.next();
          if (!res.done) {
            res.value(next);
          }
        };
        next();   
      }, 0);
    }
    sleep(secs) {
      this.tasks.push((function(secs) {
        return (next) => {
          setTimeout(() => {
            console.log(`Wake up after ${secs}!`);
            next();  
          }, secs * 1000);
        };
      })(secs));
      return this;
    }
    sleepFirst(secs) {
      this.tasks.unshift((function(secs) {
        return (next) => {
          setTimeout(() => {
            console.log(`Wake up after ${secs}!`);
            next();  
          }, secs * 1000);
        };
      })(secs));
      return this;
    }
    eat(meal) {
      this.tasks.push((function(meal) {
        return (next) => {
          console.log(`eat ${meal}~`);
          next();  
        };
      })(meal));
      return this;
    }
  }
  return new _Lazyman(name);
}
```

## 方法三: 用async实现

只需要修改遍历任务队列处理task的函数即可。(在支持es7语法的环境)这是最简洁直观的方法。

``` javascript
function LazyMan(name) {
  class _Lazyman {
    constructor(name) {
      this.name = name;
      this.tasks = [];
      this.tasks.push((resolve) => {
        console.log(`Hi! This is ${this.name}!`);
        resolve();    
      });
      // 修改遍历任务队列的函数
      const pTasks = Promise.resolve().then(async() => {
	  	for (let task of this.tasks) {
	      await new Promise(task);
	  	}
	  });
    }
    sleep(secs) {
      this.tasks.push((function(secs) {
        return (resolve) => {
          setTimeout(() => {
            console.log(`Wake up after ${secs}!`);
            resolve();  
          }, secs * 1000);
        };
      })(secs));
      return this;
    }
    sleepFirst(secs) {
      this.tasks.unshift((function(secs) {
        return (resolve) => {
          setTimeout(() => {
            console.log(`Wake up after ${secs}!`);
            resolve();  
          }, secs * 1000);
        };
      })(secs));
      return this;
    }
    eat(meal) {
      this.tasks.push((function(meal) {
        return (resolve) => {
          console.log(`eat ${meal}~`);
          resolve();  
        };
      })(meal));
      return this;
    }
  }
  return new _Lazyman(name);
}
```
关于process.nextTick、setTimeout、setImmediate等异步api可参考：  
[JavaScript 运行机制详解：再谈Event Loop]   
(http://www.ruanyifeng.com/blog/2014/10/event-loop.html)   
[The Node.js Event Loop, Timers, and process.nextTick()]   
(https://nodejs.org/en/docs/guides/event-loop-timers-and-nexttick/#setimmediate-vs-settimeout)