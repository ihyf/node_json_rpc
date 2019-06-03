const JSONRPC = {
    VERSION: '2.0',
    errorMsg: {},
    methods: {}
};
/*
错误信息 参考：https://www.jsonrpc.org/specification#error_object
| code   	|   message	         | meaning |
| -32700	|   Parse error	     | Invalid JSON was received by the server.An error occurred on the server while parsing the JSON text.  |
| -32600	|   Invalid Request	 | The JSON sent is not a valid Request object.  |
| -32601	|   Method not found | The method does not exist / is not available.  |
| -32602	|   Invalid params	 | Invalid method parameter(s).  |
| -32603	|   Internal error	 | Internal JSON-RPC error.  |
| -32000 to -32099   |   Server error	     | Reserved for implementation-defined server-errors.  |
*/
JSONRPC.errorMsg[-32700] = 'Parse Error.';
JSONRPC.errorMsg[-32600] = 'Invalid Request.';
JSONRPC.errorMsg[-32601] = 'Method Not Found.';
JSONRPC.errorMsg[-32602] = 'Invalid Params.';
JSONRPC.errorMsg[-32603] = 'Internal Error.';

/**
 * 检查给定的请求是否有效
 * JSONRPC调用
 * - "jsonrpc" 当前版本== ('2.0')
 * - "id" 请求标识，为数字
 * - "method" 指的是调用的方法名称的字符串
 * @param  {Object} rpc
 * @return {Boolean}
 */
function validRequest(rpc) {
    return rpc.jsonrpc === JSONRPC.VERSION
        && (typeof rpc.id === 'number' || typeof rpc.id === 'string')
        && typeof rpc.method === 'string';
};

/**
 * 规范化响应对象
 * @param  {Object} rpc
 * @param  {Object} obj
 * @return {Object}
 */
function normalize(rpc, obj) {
    obj.id = (rpc && typeof rpc.id === 'number' ? rpc.id : null);
    obj.jsonrpc = JSONRPC.VERSION;
    //如果错误根据错误不存在错误信息的话代码获取错误信息
    if (obj.error && !obj.error.message) obj.error.message = JSONRPC.errorMsg[obj.error.code];
    return obj;
};

/**
 * JSONRPC 请求处理
 * @param  {Object} rpc
 * @param  {Function} respond 响应回调
 */
JSONRPC.handleRequest = function (rpc, respond) {
    //版本与一些参数验证
    if (!validRequest(rpc)) return respond(normalize(rpc, { error: { code: -32600 } }));//请求协议不规范
    //函数查找
    let method = JSONRPC.methods[rpc.method];
    if (typeof method !== 'function') return respond(normalize(rpc, { error: { code: -32601 } }));// 函数或方法未找到
    //参数解析
    let params = [];

    // 未命名参数
    if (Array.isArray(rpc.params)) {
        params = rpc.params;
    } else if (typeof rpc.params === 'object') {
        //通过正则表达式过滤出参数名
        let names = method.toString().match(/\((.*?)\)/)[1].match(/[\w]+/g);
        if (names) {
            let obj =rpc.params;
            Object.keys(obj).forEach((key)=>{
                params.push(obj[key]);
            });
            // for (let i of names) params.push(rpc.params[i]);
        } else {
            //返回错误 不支持参数
            return respond(normalize(rpc, { error: { code: -32602, message: 'This service does not support named parameters.' } }));
        }
    }
    // 用给定的错误和结果进行响应
    let reply = function (err, result) {
        if (err) {
            if (typeof err === 'number') {
                respond(normalize(rpc, {
                    error: { code: err }
                }));
            } else {
                respond(normalize(rpc, {//解析异常捕获
                    error: {
                        code: err.code || -32603,
                        message: err.message
                    }
                }));
            }
        } else {
            // console.log("method是啥：",method);
            // if(result==Promise)
            if(rpc.method=="get_balance"){
                result
                    .then(data=>{
                        // console.log("data是啥：",data);
                        respond(normalize(rpc, { result: data }));
                    })
                    .catch(err=>{
                        respond(normalize(rpc, {result: {"error": "get_balance fail", "code": "50001"}}))
                    })
            } else if(rpc.method=="get_transactions"){
                method()
                    .then(data=>{
                        // console.log("data是啥：",data);
                        respond(normalize(rpc, { result: data }));
                    })
                    .catch(err=>{
                        respond(normalize(rpc, {result: {"error": "get_transactions fail", "code": "50002"}}))
                    })
            } else if(rpc.method=="get_transaction_fee"){
                method()
                    .then(data=>{
                        // console.log("data是啥：",data);
                        respond(normalize(rpc, { result: data }));
                    })
                    .catch(err=>{
                        respond(normalize(rpc, {result: {"error": "get_transaction_fee fail", "code": "50003"}}))
                    })
            } else if(rpc.method=="set_transaction"){
                method()
                    .then(data=>{
                        // console.log("data是啥：",data);
                        respond(normalize(rpc, { result: data }));
                    })
                    .catch(err=>{
                        respond(normalize(rpc, {result: {"error": "set_transaction fail", "code": "50004"}}))
                    })
            } else {
                respond(normalize(rpc, { result: result }));
            }
        }
    };
    // 追加 reply 函数作为最后一个参数
    // params.push(reply);
    // 调用方法
    try {
        reply(false, method.apply(this, params));
        // reply(false, method.apply(this));
    } catch (err) {
        reply(err);
    }
}
module.exports = JSONRPC;