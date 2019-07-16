let Promise = require('./promise.js');

// 1) Promise主要处理异步逻辑
// 2) 同一个实例，可以多次then
let p = new Promise((resolve, reject) => {
    resolve('测试测试');
    // setTimeout(function () {
    //     console.log('111');
    //     // reject('测试error');
    //     resolve('data');
    // }, 1000)
});

// 循环引用，自己等待自己完成，走向自己的失败
let promise2 = p.then(data => {
    // 返回一个promise时，让这个promise执行，promise执行后的结果，作为下个的值
    return new Promise((resolve, reject) => {
        resolve('asfasfafs');
    });
    // return promise2;
});

promise2.then((data) => {
    console.log('asf', data);
}, (error) => {
    console.log('err', error);
});

// 判断then函数的执行结果和promise2的关系
// let promise2 = p.then((value) => {
//     console.log('success', value);
// });
// promise2.then(data => {
//     console.log('sasfasd', data);
//     throw '我是一个错误';
// }, err => {
//     console.log('err', err);
// });
// p.then((value) => {
//     console.log('success', value);
// }, (reason) => {
//     console.log('error', reason);
// });
// 链式调用的特点
// 1）如果then方法返回一个普通值（包含undefined, null等，除了error和promise对象之外的值），这个值会传递给下一次then中作为成功的结果
// 2) 非普通值（promise或者报错throw error），如果是err，则会执行下一个then的错误处理函数
// 3) 如果返回的是promise，则会根据返回的promise是成功还是失败，决定下一个then是成功还是失败
// 4) 捕获错误机制（1.默认会找离自己最近的下一个then的失败）找不到就向下找，如果不捕获这个错误，控制台就会报错
// 5) jquery链式调用返回this，promise链式调用返回一个新的promise对象，因为promise状态一旦改变不可逆，then一旦成功之后无法再失败
// TODO module.exports 与 export default