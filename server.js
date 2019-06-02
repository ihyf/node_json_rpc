const http = require('http');
const fs = require('fs');
const url = require('url');
const RPC = require('./jsonrpc');
// const ExplprerWallet = require('js-oip/lib/modules/wallets/ExplorerWallet').default;
// const Insight = require('insight-explorer').Insight;
// let explorer = new Insight("https://livenet.flocha.in/api");

RPC.methods = {
    demo(t) {
        return "hello" + (t || "word");
    },
    asd(a) {
        console.log(a);
        return 999;
    },
    aaa(b, c) {
        return b + c;
    },
    // bbb(){
    //     return explorer.getAddressProperties("FBjBWwd4Bm8MAYdJqqLB2pvDXzP1AomBXK", "balance");
    // },
    eee: (a, v) => {
        return a * v;
    },
    getBalance(address) {

    },
    ccc: (o) => {
        //异常模拟
        return o / asdsad;
    },
    //几种写法
    test(a, b, c, d, e) {
        return { a, b, c, d, e };
    },
    test2:function(a, b, c, d, e) {
        return { a, b, c, d, e };
    },
    test3:(a, b, c, d, e)=>{
        return { a, b, c, d, e };
    }
};
/*
fetch('/jsonrpc', {
    headers: {
        "Content-Type": "application/json"
    },
    method: 'POST',
    body: JSON.stringify([
		 { "jsonrpc": "2.0", "method": "test", "id": 1, "params": [1,2,3,4,5] },
		{ "jsonrpc": "2.0", "method": "test2", "id": 2, "params": [1,2,3,4,5] },
		{ "jsonrpc": "2.0", "method": "test3", "id": 3, "params":  [1,2,3,4,5] },
        { "jsonrpc": "2.0", "method": "test", "id": 4, "params": {a:1,b:2,c:3,d:4,e:5} },
		{ "jsonrpc": "2.0", "method": "test2", "id": 5, "params": {a:1,b:2,c:3,d:4,e:5} },
		{ "jsonrpc": "2.0", "method": "test3", "id": 6, "params": {a:1,b:2,c:3,d:4,e:5} },
	])
}).then(v => {

    return v.json();
}).then(v => {
    console.log(v)
})
*/
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