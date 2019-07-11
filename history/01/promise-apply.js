let Promise = require('./promise.js');

let p = new Promise((resolve, reject) => {
    console.log('111');
    reject('测试error');
    resolve('data');
});


p.then((value) => {
    console.log('success', value);
}, (reason) => {
    console.log('error', reason);
});



// TODO module.exports 与 export default