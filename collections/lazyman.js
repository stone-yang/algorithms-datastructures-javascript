/**
 * Question:
 * 实现一个LazyMan，可以按照以下方式调用:
 * LazyMan(“Hank”)输出:
 * Hi! This is Hank!

 * LazyMan(“Hank”).sleep(10).eat(“dinner”)输出
 * Hi! This is Hank!
 * //等待10秒..
 * Wake up after 10
 * Eat dinner~

 * LazyMan(“Hank”).eat(“dinner”).eat(“supper”)输出
 * Hi This is Hank!
 * Eat dinner~
 * Eat supper~

 * LazyMan(“Hank”).sleepFirst(5).eat(“supper”)输出
 * //等待5秒
 * Wake up after 5
 * Hi This is Hank!
 * Eat supper

 * 以此类推。
 * 题目出处: 微信前端团队
 */

/**
 * 方法一: 用promise实现
 * 每个任务记录为Promise构造函数的参数,执行任务队列时为每个任务创建一个promise
 * 对于简单的场景用promise实现看起来最简洁, 但是如果涉及到每个流程都有返回值的时候就不如generator或者async直观了
 */
function LazyMan(name) {
  class _Lazyman {
    constructor(name) {
      this.name = name;
      // 任务队列: 其中任务的结构为Promise构造函数的参数
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
      // 这里还可以用async实现, 稍加修改就可以形成方法三
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

/**
 * 方法二: 用generator实现
 * 每个任务记录为以next函数为参数的普通函数,next函数表示将执行权交还给iterator,进而再继续下一个任务
 * generator的实现很直观,缺点是要另外写一个next函数才能把iterator调度起来
 */
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
      // 同类型方法参考 http://www.ruanyifeng.com/blog/2014/10/event-loop.html
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

/**
 * 方法三: 用async实现
 * 只需要修改遍历任务队列处理task的函数即可
 * (在支持es7语法的环境)这是最简洁直观的方法
 */
let pTasks = Promise.resolve().then(async() => {
  for (let task of this.tasks) {
    await new Promise(task);
  }
});
