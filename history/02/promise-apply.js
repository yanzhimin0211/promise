let Promise = require('./promise.js');

// 1) Promise主要处理异步逻辑
// 2) 同一个实例，可以多次then
let p = new Promise((resolve, reject) => {
    setTimeout(function () {
        console.log('111');
        reject('测试error');
        resolve('data');
    }, 1000)
});


p.then((value) => {
    console.log('success', value);
}, (reason) => {
    console.log('error', reason);
});

p.then((value) => {
    console.log('success', value);
}, (reason) => {
    console.log('error', reason);
});

// TODO module.exports 与 export default