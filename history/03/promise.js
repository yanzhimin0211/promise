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

Promise.prototype.then = function (onFullFilled, onRejected) {
    let self = this;
    if (self.status === 'resolved') { // 对于同步的调用，在调用then方法时，状态已经更改，因此可以直接执行某些方法
        onFullFilled(self.value);
    }
    if (self.status === 'rejected') {
        console.log('333');
        onRejected(self.reason);
    }
    if (self.status === 'pending') { // 异步的调用，在调用then方法时，应该还在pending状态，因此先把需要执行的方法保存起来
        // 订阅
        self.onResolevedCallbacks.push(() => {
            onFullFilled(self.value);
        });
        self.onRejectedCallbacks.push(() => {
            onRejected(self.reason);
        });
    }
}

module.exports = Promise;