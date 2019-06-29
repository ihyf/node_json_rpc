const http = require('http');
const fs = require('fs');
const url = require('url');
const RPC = require('./jsonrpc');
const ExplprerWallet = require('js-oip/lib/modules/wallets/ExplorerWallet').default;
const Insight = require('insight-explorer').Insight;


RPC.methods = {
    //获取余额
    get_balance(address){

        //目前这句有问题 todo
        if (address == null || address == ""){
            return {"error":"address is null", "code":"40001"}
        }

        let explorer = new Insight("https://livenet.flocha.in/api");
        var data;
        var promise = new Promise((resolve, reject)=>{
            explorer.getAddressProperties(address, "balance")
                .then(result => {
                    // console.log("result是啥：",result);
                    data = result;
                    resolve(data)
                })
                .catch(err=>{
                    console.log("get_balance error");
                    reject(err)
                })
        })
        return promise
    },
    //获取交易记录
    get_transactions(address, page){
        //目前这句有问题 todo
        // if (address == null || address == ""){
        //     return {"error":"address is null", "code":"40001"}
        // }

        let explorer = new Insight("https://livenet.flocha.in/api");
        var data;
        var promise = new Promise((resolve, reject)=>{
            explorer.getTransactionsForAddress(address)
                .then(result => {
                    // console.log("result是啥：",result);
                    data = result;
                    resolve(data)
                })
                .catch(err=>{
                    console.log("get_transactions error");
                    reject(err)
                })
        });
        promise["address"] = address
        return promise
    },
    //查询交易手续费
    get_transaction_fee(wif, address, value, flodata){
        // if (wif ==null || address == null && value == null){
        //     return {"error":"wif, address, value have key is null", "code":"40002"}
        // }
        let explorer = new Insight("https://livenet.flocha.in/api");
        var explprerWallet = new ExplprerWallet({ network: 'mainnet', wif: wif });
        var output = {
            address: address,
            value: 1e8*value
        }
        var data;
        var promise = new Promise((resolve, reject)=>{
            explprerWallet.buildInputsAndOutputs(flodata, output)
                .then(result => {
                    // console.log("result是啥：",result);
                    data = result;
                    resolve(data)
                })
                .catch(err=>{
                    console.log("get_transaction_fee error");
                    reject(err)
                })
        })
        return promise
    },
    //转账
    set_transaction(wif, address, value, flodata){
        // if (wif ==null || address == null && value == null){
        //     return {"error":"wif, address, value have key is null", "code":"40002"}
        // }
        let explorer = new Insight("https://livenet.flocha.in/api");
        var explprerWallet = new ExplprerWallet({ network: 'mainnet', wif: wif });
        var output = {
            address: address,
            value: 1e8*value
        }
        var data;
        var promise = new Promise((resolve, reject)=>{
            explprerWallet.sendTx(output, flodata)
                .then(result => {
                    // console.log("result是啥：",result);
                    data = result;
                    resolve(data)
                })
                .catch(err=>{
                    console.log("set_transaction error");
                    reject(err)
                })
        })
        return promise
    },
    //get utxo
    get_address_utxo(address){
        let explorer = new Insight("https://livenet.flocha.in/api");

        let utxo;
        var promise = new Promise((resolve, reject)=>{
            explorer.getAddressUtxo(address)
                .then(result => {
                    // console.log("result是啥：",result);
                    data = result;
                    resolve(data)
                })
                .catch(err=>{
                    console.log("get utxo error");
                    reject(err)
                })
        })
        return promise
    },
    //broadcast_raw_hex
    broadcast_raw_hex(hex){

        let explorer = new Insight("https://livenet.flocha.in/api");
        // hexxx = "0200000001243f3e430f6334dfb366c971cb917b2793fbf3bdc8241914e776e95ca80a698e010000006b483045022100b74b438577de1c2ea7b8eb1ebd58d3a05819eee43ce8d05ae00a3b950e4291a202205e18a50f8270529fcf093a4c28846dd2587f9bbc7cda3cc0c4148bf7ed183a260121024f5374c77ad80945578b1894246798d3ef6abdacba254c0b5b937d3d8b331bb4ffffffff0240420f00000000001976a914e6ac71da35d81b8549701d15581a63d4028deb6088acaa419d71000000001976a91440b1a4a6fc7c8b88ef2a1beac1fe3de118e8d08888ac0000000000"
        var promise = new Promise((resolve, reject)=>{
            explorer.broadcastRawTransaction(hex)
                .then(result => {
                    console.log("result是啥：",result);
                    data = result;
                    resolve(data)
                })
                .catch(err=>{
                    console.log(err);
                    console.log("broadcastRawHex error");
                    reject(err);
                })
        })
        return promise
    },
    //broadcast_raw_hex1
    broadcast_raw_hex1(hex){

        let explorer = new Insight("https://livenet.flocha.in/api");
        var explprerWallet = new ExplprerWallet({ network: 'mainnet', wif: "REY4ZqznnrjiiUGHbyj9FRYqW1bPQb8tQdGP6W64HFFJdbN927sE" });
        var output = {
            address: "FBjBWwd4Bm8MAYdJqqLB2pvDXzP1AomBXK",
            value: 1e8*0.1
        }
        var data;
        hex = "0200000001c2f363836ac944f31e397a2c750eaa208562f6865b19ec7890d280f03d625fae010000006a4730440220196481d17e3c8dcb0df2c41884f48ec85367cfbeb65cf3cecd9f42a67174df9e022040ead1dc31454d024100a7127c4a66f258bc1f83175e4e4f4a1fa73d5f1b01d70121024f5374c77ad80945578b1894246798d3ef6abdacba254c0b5b937d3d8b331bb4ffffffff0240420f00000000001976a914e6ac71da35d81b8549701d15581a63d4028deb6088acc822cb71000000001976a91440b1a4a6fc7c8b88ef2a1beac1fe3de118e8d08888ac0000000000"
        var promise = new Promise((resolve, reject)=>{
            explprerWallet.sendTx1(output, "")
                .then(result => {
                    // console.log("result是啥：",result);
                    data = result;
                    resolve(data)
                })
                .catch(err=>{
                    console.log("set_transaction error");
                    reject(err)
                })
        })
        return promise
    }
};


function sleep(numberMillis) {
    var now = new Date();
    var exitTime = now.getTime() + numberMillis;
    while (true) {
        now = new Date();
        if (now.getTime() > exitTime)
            return;
    }
}
const jsonrpc = RPC.handleRequest;

const routes = {//<====路由
    "/jsonrpc"(req, res) {
        var contentType = req.headers['content-type'] || '';
        //接收post请求
        if (req.method === 'POST' && contentType.indexOf('application/json') >= 0) {
            var data = '';
            req.setEncoding('utf8');
            req.addListener('data', function (chunk) { data += chunk; });
            req.addListener('end', function () {
                //响应函数
                let respond = function (obj) {
                    var body = JSON.stringify(obj);
                    res.writeHead(200, {
                        'Content-Type': 'application/json',
                        'Content-Length': Buffer.byteLength(body)
                    });
                    res.end(body);
                };
                try {
                    var rpc = JSON.parse(data),//获取json数据
                        batch = Array.isArray(rpc);//<===是否批处理
                    if (batch) {
                        var responses = [],
                            len = rpc.length,
                            pending = len;
                        for (var i = 0; i < len; ++i) {
                            (function (rpc) {
                                jsonrpc(rpc, function (obj) {
                                    responses.push(obj);
                                    if (!--pending) {
                                        respond(responses);
                                    }
                                });
                            })(rpc[i]);
                        }
                    } else {
                        jsonrpc(rpc, respond);
                    }
                } catch (err) {
                    console.log(err);
                    return respond({ err: 1110 });
                }
            });
        } else {
            res.end();
        }
    },
    "/"(request, response) {
        response.writeHead(200, { 'Content-Type': 'text/html' });
        response.write(`服务已开启`);
        response.end();
    },
    "/404"(request, response) {
        response.writeHead(404, { 'Content-Type': 'text/html' });
        response.write("404");
        response.end();
    }
}
// 创建服务器
http.createServer(function (request, response) {
    // 解析请求，包括文件名
    var pathname = url.parse(request.url).pathname;
    // 输出请求的文件名
    console.log("Request for " + pathname + " received.");
    route = routes[pathname]
    if (route) {
        route(request, response);
    } else {
        routes["/404"](request, response);
    }
}).listen(8889, '0.0.0.0');
console.log("服务已启动")