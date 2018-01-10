var request = require('request');
var crypto = require('crypto');
var formurlencoded = require('form-urlencoded');

var config = require('../../config');

var
    api_key = config.poloniex.api_key,
    api_secret = config.poloniex.api_secret,
    baseRequest = request.defaults({
        headers: {
            'Content-type': 'application/x-www-form-urlencoded',
            'Key': api_key
        },
        baseUrl: 'https://poloniex.com'
    });

function getOptions(payload) {
    payload = formurlencoded(payload);
    var signature = crypto.createHmac('sha512', api_secret).update(payload).digest('hex');
    return {
        url: '/tradingApi',
        headers: {
            'Sign': signature
        },
        body: payload
    };
}

var returnBalances = function (callback) {
    var payload = {
        'command': 'returnCompleteBalances',
        'nonce': Date.now().toString()
    };

    var options = getOptions(payload);

    baseRequest.post(options, function (error, response, body) {
        callback(JSON.parse(body));
    });
};

var returnTradeHistory = function (callback) {
    var payload = {
        'command': 'returnTradeHistory',
        'nonce': Date.now().toString(),
        'currencyPair': 'USDT_ETH'
    };

    var options = getOptions(payload);

    baseRequest.post(options, function (error, response, body) {
        callback(JSON.parse(body));
    });
};

var returnOpenOrders = function (callback) {
    var payload = {
        'command': 'returnOpenOrders',
        'nonce': Date.now().toString(),
        'currencyPair': 'USDT_ETH'
    };

    var options = getOptions(payload);

    baseRequest.post(options, function (error, response, body) {
        callback(JSON.parse(body));
    });
};

var cancelOrder = function (orderNumber, callback) {
    var payload = {
        'command': 'cancelOrder',
        'nonce': Date.now().toString(),
        'orderNumber': orderNumber
    };

    var options = getOptions(payload);

    baseRequest.post(options, function (error, response, body) {
        callback(JSON.parse(body));
    });
};

var newOrder = function (amount, price, side, pair, callback) {
    var payload = {
        'command': side,
        'nonce': Date.now().toString(),
        'amount': amount,
        'rate': price,
        'currencyPair': pair === 'eth' ? 'USDT_ETH' : 'USDT_BTC'
    };

    var options = getOptions(payload);

    baseRequest.post(options, function (error, response, body) {
        callback(JSON.parse(body));
    });
};

module.exports = {
    balances: returnBalances,
    trades: returnTradeHistory,
    liveorders: returnOpenOrders,
    cancelorder: cancelOrder,
    neworder: newOrder
};