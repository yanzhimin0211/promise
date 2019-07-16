function Promise(executor) {
    let self = this;
    self.status = 'pending'; // 默认promise的状态是pending
    self.value = undefined;
    self.reason = undefined;
    self.onResolevedCallbacks = [];
    self.onRejectedCallbacks = [];

    function resolve(value) {
        if (self.status === 'pending') {
            self.value = value;
            self.status = 'resolved';
            self.onResolevedCallbacks.forEach(fn => {
                fn();
            });
        }
    }

    function reject(reason) {
        if (self.status === 'pending') {
            self.reason = reason;
            self.status = 'rejected';
            self.onRejectedCallbacks.forEach(fn => {
                fn();
            });
        }
    }
    executor(resolve, reject);
}

// 这个规范是通用的，我们的promise可能在别的promise中使用
function resolvePromise(promise2, x, resolve, reject) { // 判断x是不是promise
    if (promise2 === x) { // 防止自己等待自己
        return reject(new TypeError('循环引用'));
    }

    if ((x !== null && typeof x === 'object') || typeof x === 'function') {
        // 很有可能是一个promise
        try {
            let then = x.then; // then属性具有getter，此时获取时会发生异常，因此包括在try， catch块中
            if (typeof then === 'function') { // 就认为是promise，执行其then方法
                then.call(x, (y) => { // call锁定this指向， y自己本身也是一个promise
                    resolvePromise(promise2, y, resolve, reject); // 递归调用，直到y是一个普通值退出当前递归
                    // resolve(y); // 成功拿到成功的结果，让promise2变成成功态
                }, (r) => {
                    reject(r);
                }); 
            } else { // 当前then是一个普通对象
                resolve(x);
            }
        } catch(err) {
            reject(err);
        }
    } else {
        resolve(x); // 普通值直接成功即可
    }
}

// TODO 如果onFullFilled或者onRejected里面有一个异步逻辑怎么办呢？
Promise.prototype.then = function (onFullFilled, onRejected) {
    let self = this;
    // 调用后需要再次返回一个全新的promise
    // 需要拿到当前then方法成功或者失败后的结果
    let promise2 = new Promise((resolve, reject) => {
        if (self.status === 'resolved') { // 对于同步的调用，在调用then方法时，状态已经更改，因此可以直接执行某些方法
            setTimeout(() => { // 这里要使用promise2，所以需要增加异步保证可以获取到promise2
                try {
                    let x = onFullFilled(self.value);
                    resolvePromise(promise2, x, resolve, reject);
                } catch (err) {
                    reject(err); // 如果执行函数时，抛出失败，那么会走向下一个then的失败状态
                }
            }, 0);
            
        }
        if (self.status === 'rejected') {
            setTimeout(() => { // 这里要使用promise2，所以需要增加异步保证可以获取到promise2
                try {
                    let x = onRejected(self.reason);
                    resolvePromise(promise2, x, resolve, reject);
                } catch (err) {
                    reject(err);
                }
            }, 0);
        }
        if (self.status === 'pending') { // 异步的调用，在调用then方法时，应该还在pending状态，因此先把需要执行的方法保存起来
            // 订阅
            self.onResolevedCallbacks.push(() => {
                setTimeout(() => { // 这里要使用promise2，所以需要增加异步保证可以获取到promise2
                    try {
                        let x = onFullFilled(self.value);
                        resolvePromise(promise2, x, resolve, reject);
                    } catch (err) {
                        reject(err);
                    }
                }, 0);
            });
            self.onRejectedCallbacks.push(() => {
                setTimeout(() => { // 这里要使用promise2，所以需要增加异步保证可以获取到promise2
                    try {
                        let x = onRejected(self.reason);
                        resolvePromise(promise2, x, resolve, reject);
                    } catch (err) {
                        reject(err);
                    }
                }, 0);
            });
        }
    });
    return promise2;
}

module.exports = Promise;