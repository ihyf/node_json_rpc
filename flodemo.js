// const FlorinCoin = require('../dist/1.0.0/FLO');
const FlorinCoin = require('./coin/FlorinCoin');

let address = 'FBjBWwd4Bm8MAYdJqqLB2pvDXzP1AomBXK';
//私钥
let wif = 'REY4ZqznnrjiiUGHbyj9FRYqW1bPQb8tQdGP6W64HFFJdbN927sE';
//交易单号
let txid = 'd701ebbbce03ba7491f920dd2130265bea166ef7d7a39d7a2689813b6c12cc68';

// console.log(FlorinCoin);
// console.log(FlorinCoin.getFloTransactionOutput(address, 1.5));

//获取余额
// FlorinCoin.getFloBalance(address).then(result => {
//     console.log(result);
// });
//
// //获取交易记录
FlorinCoin.getFloTransactionsForAddress(address).then(result => {
    console.log(result);
})
//
//获取交易详情
// FlorinCoin.getFloTransactionDetail('d9ac50e3ed9ea3c4cf193c502920fb4e1c8a4e22de53994cc480b0f79661fb9b ').then(result => {
//     console.log(result);
// })
//
// //转账1.5个flo
// let output = FlorinCoin.getFloTransactionOutput(address, 1.5);
// FlorinCoin.setFloTransaction(wif, output, '').then(txid => {
//     console.log(txid);
// })

//查询转账手续费
// let output = FlorinCoin.getFloTransactionOutput(address, 1.5);
// FlorinCoin.getFloTransactionFee(wif, output, '').then(result => {
//     console.log(result);
// })


