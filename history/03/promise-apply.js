// let Promise = require('./promise.js');

// 1) Promise主要处理异步逻辑
// 2) 同一个实例，可以多次then
// let p = new Promise((resolve, reject) => {
//     setTimeout(function () {
//         console.log('111');
//         reject('测试error');
//         resolve('data');
//     }, 1000)
// });

let fs = require('fs');
// fs.readFile('./name.txt', 'utf-8', (err, data) => {
//     console.log('data', data);
//     fs.readFile(data, 'utf-8', (err, data) => {
//         console.log(data);
//     });
// });

function readFile(url) {
    return new Promise((resolve, reject) => {
        fs.readFile(url, 'utf-8', (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        })
    });
}

// 链式调用的特点
// 1）如果then方法返回一个普通值（包含undefined, null等，除了error和promise对象之外的值），这个值会传递给下一次then中作为成功的结果
// 2) 非普通值（promise或者报错throw error），如果是err，则会执行下一个then的错误处理函数
// 3) 如果返回的是promise，则会根据返回的promise是成功还是失败，决定下一个then是成功还是失败
// 4) 捕获错误机制（1.默认会找离自己最近的下一个then的失败）找不到就向下找，如果不捕获这个错误，控制台就会报错
// 5) jquery链式调用返回this，promise链式调用返回一个新的promise对象，因为promise状态一旦改变不可逆，then一旦成功之后无法再失败
// readFile('./name.txt').then((data) => {
//     // console.log('data', data);
//     // return 100;
//     throw new Error('出错了');
// }, (err) => {
//     console.log('err', err);
// }).then(data => {
//     console.log('data', data);
// }, err => {
//     console.log('err', err);
// })

readFile('./name.txt').then((data) => {
    return readFile(data + '1');
}, (err) => {
    console.log('err', err);
}).then(data => {
    console.log('data', data);
}, err => {
    console.log('error', err); // 在err或者catch中执行之后，返回的是一个普通值，依然会走下一个then的成功函数
}).catch(err => {
    console.log('catch', err);
}).then(data => {
    console.log('错误后的then', data); // 返回undefined
})
// TODO module.exports 与 export default