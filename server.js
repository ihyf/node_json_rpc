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
    get_transactions(address){
        //目前这句有问题 todo
        if (address == null || address == ""){
            return {"error":"address is null", "code":"40001"}
        }

        let explorer = new Insight("https://livenet.flocha.in/api");
        var data;
        var promise = new Promise((resolve, reject)=>{
            explorer.getTransactionsForAddress(saveAddress)
                .then(result => {
                    // console.log("result是啥：",result);
                    data = result;
                    resolve(data)
                })
                .catch(err=>{
                    console.log("get_transactions error");
                    reject(err)
                })
        })
        return promise
    },
    //查询交易手续费
    get_transaction_fee(wif, address, value){
        if (wif ==null || address == null && value == null){
            return {"error":"wif, address, value have key is null", "code":"40002"}
        }
        let explorer = new Insight("https://livenet.flocha.in/api");
        var explprerWallet = new ExplprerWallet({ network: 'mainnet', wif: saveWif });
        var output = {
            address: saveAddress,
            value: 1e8*saveValue
        }
        var data;
        var promise = new Promise((resolve, reject)=>{
            explprerWallet.buildInputsAndOutputs('', output)
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
    set_transaction(wif, address, value){
        if (wif ==null || address == null && value == null){
            return {"error":"wif, address, value have key is null", "code":"40002"}
        }
        let explorer = new Insight("https://livenet.flocha.in/api");
        var explprerWallet = new ExplprerWallet({ network: 'mainnet', wif: saveWif });
        var output = {
            address: saveAddress,
            value: 1e8*saveValue
        }
        var data;
        var promise = new Promise((resolve, reject)=>{
            explprerWallet.sendTx(output, '')
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
}).listen(8889);
console.log("服务已启动")