function Promise(executor) {
    let self = this;
    self.status = 'pending'; 
    self.value = undefined;
    self.reason = undefined;
    console.log('44444');// 默认promise的状态是pending
    function resolve(value) {
        if (self.status === 'pending') {
            self.value = value;
            self.status = 'resolved';
        }
    }

    function reject(reason) {
        if (self.status === 'pending') {
            self.reason = reason;
            self.status = 'rejected';
        }
    }
    executor(resolve, reject);
}

Promise.prototype.then = function(onFullFilled, onRejcted) {
    console.log('222');
    let self = this;
    if (self.status === 'resolved') {
       
        onFullFilled(self.value);
    }
    if (self.status === 'rejected') {
        console.log('333');
        onRejcted(self.reason);
    }
}

module.exports = Promise;