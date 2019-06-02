const ExplprerWallet = require('js-oip/lib/modules/wallets/ExplorerWallet').default;
const Insight = require('insight-explorer').Insight;
let explorer = new Insight("https://livenet.flocha.in/api");


//查询FLO的余额
async function getFloBalance (address) {
    return explorer.getAddressProperties(address, "balance");
}

//查询FLO的交易记录
async function getFloTransactionsForAddress(address) {
    return explorer.getTransactionsForAddress(address);
}

//查询详细的交易信息
async function getFloTransactionDetail (txid) {
    return explorer.getTransaction(txid);
}

function getFloTransactionOutput (address, value) {
    return {
        address: address,
        value: 1e8*value
    }
}

//查询交易手续费
function getFloTransactionFee (wif, output, flodata) {
    const explprerWallet = new ExplprerWallet({ network: 'mainnet', wif: wif });
    return explprerWallet.buildInputsAndOutputs(flodata, output);
}

//发送交易
async function setFloTransaction(wif, output, flodata) {
    const explprerWallet = new ExplprerWallet({ network: 'mainnet', wif: wif });
    return explprerWallet.sendTx(output, flodata);
}

module.exports = {
    getFloBalance,
    getFloTransactionsForAddress,
    getFloTransactionDetail,
    getFloTransactionOutput,
    getFloTransactionFee,
    setFloTransaction
};