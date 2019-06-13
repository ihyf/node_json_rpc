const NodeRSA = require('node-rsa');

const srv_public_key_data = '-----BEGIN PUBLIC KEY-----\n' +
    'MIICIjANBgkqhkiG9w0BAQEFAAOCAg8AMIICCgKCAgEAqy+Z5H0B8scLyzW09g53\n' +
    'YzvAk+UjNgMlLX56y7i5QgDH/M7/XFzf1Kwgnd7siYdACQstU2vcLXoIj5N39hOZ\n' +
    'HeTLJQJho4mJLeC1Y5cjbTwKp1Rdad7JL/jDD6gNefrK81BXLGrQJHtJ3Ve7s9yX\n' +
    '/1oU+okCDq8IivTDJn7ZhX4Um7ZP3VOX57x6uQ1BKvK4/HMTwUYpYHjGk7INKJar\n' +
    'bQI9e5RB0S6TkAHOBDJunCHFctNKyA9HLqFnNOwq/b22Ui7SZOdnAcGXoYTXDWb0\n' +
    'Xgf5GjLLhk6A3A15OjXBz4XMjsykUJWnXuZe/XpYMWD/hO3GWF5o/KIR01qxuCIa\n' +
    'VUxSYyKrFTn66IZFJQAYUVJC6Qd2GpkYbJU725aNf9jdtgwtzROudysfzntfacdo\n' +
    'BSWrJfUMZS32XG6ztngdGhArTBWoZn85GvSJ90iiPoLT+nXAPZbCZqD++JN2kd4n\n' +
    'IWDkzdgaYu39jaWavgjAKvqM3ZAT12Xs8Hn5qs2q17LNb6gUPW00Q3HTRBV8xm0y\n' +
    'aWvvQlEC6lwJDFyoeHp/GKpJROP84SBHScSuiY1ZrUy8Ozlke8PorqftUXgdbPDD\n' +
    'a1OFluqdi7vv5XCDfw907Ooc8nDxykq5zImU4LEHIZVt/q9hzHMsizLDj3Rt28vz\n' +
    '0PNqMEbfIsc7Uy87tHGe77ECAwEAAQ==\n' +
    '-----END PUBLIC KEY-----';
const srv_private_key_data = '-----BEGIN RSA PRIVATE KEY-----\n' +
    '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\n' +
    '-----END RSA PRIVATE KEY-----';

const cli_public_key_data = '-----BEGIN PUBLIC KEY-----\n' +
    'MIICIjANBgkqhkiG9w0BAQEFAAOCAg8AMIICCgKCAgEAnqlMzUGzfi73845Xi+zm\n' +
    '0wuKgD49m1s7TkFlTlIiMWC0O85i4Jh5Y6cyA6fCoz9KXECGE35fzu7jBgU3VP4N\n' +
    'DlmMcWEEEZPBwhXD85oaXekGvRYQp34M8f8OOWWMICe28LmNz68Sdb1w8I346sDO\n' +
    'HPtU3938U2KHWQTQsXgcOso8mwBj6WWwscQ9bnNqshckhwxTzIckDMVJ2o/gthxB\n' +
    'WtwErBYIEj32ZKbNN92ShoQmS9xdlSl2y8NOJN6+5BNQeQTS2qUK0sAwpr9TILzc\n' +
    'jlqeBnDU4UZEA2rDwYg3RAVswJ6bFQzWZgCSY93FXaHdcKApWY33u3nq1CI7jxpk\n' +
    'a2Z3zKWQ6OPMQfZIrsnlpzcxet/kDMFrPCJ2XHT0CoEL8C5jIWtLTfJbpLc0X9bI\n' +
    'Y/D+EGwIeaiGLmcfJ++yCKcrUt5ytLHJV4GhIg9W6ziFKaSFZMJrpzbQFMFz0YI9\n' +
    'Ws4B6BBogu4Hq799UTsKvlA2NgZRZmLOncMP158lHAKgUGWagGWTjAwPExxooXe2\n' +
    'V2VuXiSJgdgjvwD7z3dqQZtIeDOx253q/YJVbJ0SeHtUUKU4jqHkFp5J7jw5mWKB\n' +
    'hrwUDdj+81r6k1vfJBXf80xdh2+MZVAtr20lSaPgLARX3AxOtZCyETZNP8gsZvjr\n' +
    'uTygcFuPc8P3EwkLJke34+kCAwEAAQ==\n' +
    '-----END PUBLIC KEY-----\n';
const cli_private_key_data = '-----BEGIN RSA PRIVATE KEY-----\n' +
    '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\n' +
    '-----END RSA PRIVATE KEY-----\n';

// 生成 srv 的公私钥对象
const srv_public_key = new NodeRSA(srv_public_key_data);
const srv_private_key = new NodeRSA(srv_private_key_data);

// 生成 cli 的公私钥对象
const cli_public_key = new NodeRSA(cli_public_key_data);
const cli_private_key = new NodeRSA(cli_private_key_data);

const text = 'Hello RSA!';


//签名
const sign = cli_private_key.sign(text, 'base64', 'utf8');
console.log('cli 私钥加签:', sign);

//加密
const encrypted = srv_public_key.encrypt(text, 'base64');
console.log('srv 公钥加密:', encrypted);

// 解密
const decrypted = srv_private_key.decrypt(encrypted, 'utf8');
console.log('srv 私钥解密:', decrypted);

//验签
const verify = cli_public_key.verify(sign, decrypted, 'utf8', 'base64');
console.log('cli 公钥验签:', verify);
