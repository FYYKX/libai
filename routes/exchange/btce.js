var request = require('request');
var crypto = require('crypto');
var formurlencoded = require('form-urlencoded');

var config = require('../../config');

var
    api_key = config.btce.api_key,
    api_secret = config.btce.api_secret,
    baseRequest = request.defaults({
        headers: {
            'Content-type': 'application/x-www-form-urlencoded',
            'Key': api_key
        },
        baseUrl: 'https://btc-e.com'
    });

var nonce = Date.now() / 1000 | 0;

function get_nonce() {
    nonce += 1;
    return nonce.toString();
}

function getOptions(payload) {
    payload = formurlencoded(payload);
    var signature = crypto.createHmac('sha512', api_secret).update(payload).digest('hex');
    return {
        url: '/tapi',
        headers: {
            'Sign': signature
        },
        body: payload
    };
}

var getInfo = function (callback) {
    var payload = {
        'method': 'getInfo',
        'nonce': get_nonce()
    };

    var options = getOptions(payload);

    baseRequest.post(options, function (error, response, body) {
        if (!error && response.statusCode === 200) {
            callback(JSON.parse(body));
        }
    });
};

var ActiveOrders = function (pair, callback) {
    var payload = {
        'method': 'ActiveOrders',
        'nonce': get_nonce(),
        'pair': pair
    };

    var options = getOptions(payload);

    baseRequest.post(options, function (error, response, body) {
        callback(JSON.parse(body));
    });
};

var CancelOrder = function (order_id, callback) {
    var payload = {
        'method': 'CancelOrder',
        'nonce': get_nonce(),
        'order_id': order_id
    };

    var options = getOptions(payload);

    baseRequest.post(options, function (error, response, body) {
        callback(JSON.parse(body));
    });
};

var Trade = function (amount, price, type, pair, callback) {
    var payload = {
        'method': 'Trade',
        'nonce': get_nonce(),
        'pair': pair === 'eth' ? 'eth_usd' : 'btc_usd',
        'type': type,
        'rate': price,
        'amount': amount
    };
    console.log(payload);
    var options = getOptions(payload);

    baseRequest.post(options, function (error, response, body) {
        callback(JSON.parse(body));
    });
};

var TradeHistory = function (callback) {
    var payload = {
        'method': 'TradeHistory',
        'nonce': get_nonce(),
        'pair': 'btc_usd'
    };

    var options = getOptions(payload);

    baseRequest.post(options, function (error, response, body) {
        callback(JSON.parse(body));
    });
};

module.exports = {
    balances: getInfo,
    liveorders: ActiveOrders,
    cancelorder: CancelOrder,
    neworder: Trade,
    trades: TradeHistory
};