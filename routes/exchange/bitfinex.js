var request = require('request');
var crypto = require('crypto');

var config = require('../../config');

var
    api_key = config.bitfinex.api_key,
    api_secret = config.bitfinex.api_secret,
    baseRequest = request.defaults({
        headers: {
            'X-BFX-APIKEY': api_key
        },
        baseUrl: 'https://api.bitfinex.com/v1'
    });

function getOptions(url, payload) {
    payload = new Buffer(JSON.stringify(payload)).toString('base64');
    var signature = crypto.createHmac('sha384', api_secret).update(payload).digest('hex');
    return {
        url: url,
        headers: {
            'X-BFX-PAYLOAD': payload,
            'X-BFX-SIGNATURE': signature
        },
        body: payload
    };
}

var balances = function (callback) {
    var url = '/balances';
    var payload = {
        'request': '/v1' + url,
        'nonce': Date.now().toString()
    };

    var options = getOptions(url, payload);

    baseRequest.post(options, function (error, response, body) {
        callback(JSON.parse(body));
    });
};

var activeorders = function (callback) {
    var url = '/orders';
    var payload = {
        'request': '/v1' + url,
        'nonce': Date.now().toString()
    };

    var options = getOptions(url, payload);

    baseRequest.post(options, function (error, response, body) {
        callback(JSON.parse(body));
    });
};

var orderstatus = function (callback) {
    var url = '/order/status';
    var payload = {
        'request': '/v1' + url,
        'nonce': Date.now().toString(),
        'order_id': 603520385
    };

    var options = getOptions(url, payload);

    baseRequest.post(options, function (error, response, body) {
        callback(JSON.parse(body));
    });
};


var newOrder = function (amount, price, side, symbol, callback) {
    var url = '/order/new';
    var payload = {
        'request': '/v1' + url,
        'nonce': Date.now().toString(),
        'symbol': symbol,
        'amount': amount,
        'price': price,
        'exchange': 'bitfinex',
        'side': side,
        'type': 'exchange limit'
    };

    var options = getOptions(url, payload);

    baseRequest.post(options, function (error, response, body) {
        callback(JSON.parse(body));
    });
};

var cancel = function (order_id, callback) {
    var url = '/order/cancel';
    var payload = {
        'request': '/v1' + url,
        'nonce': Date.now().toString(),
        'order_id': order_id
    };

    var options = getOptions(url, payload);

    baseRequest.post(options, function (error, response, body) {
        callback(JSON.parse(body));
    });
};

var cancelAll = function (callback) {
    var url = '/order/cancel/all';
    var payload = {
        'request': '/v1' + url,
        'nonce': Date.now().toString()
    };

    var options = getOptions(url, payload);

    baseRequest.post(options, function (error, response, body) {
        callback(JSON.parse(body));
    });
};

var pasttrades = function (symbol, callback) {
    var url = '/mytrades';
    var payload = {
        'request': '/v1' + url,
        'nonce': Date.now().toString(),
        'symbol': symbol,
        'limit_trades': 5
    };

    var options = getOptions(url, payload);

    baseRequest.post(options, function (error, response, body) {
        callback(JSON.parse(body));
    });
};

module.exports = {
    balances: balances,
    liveorders: activeorders,
    cancelorder: cancel,
    cancelallorders: cancelAll,
    orderstatus: orderstatus,
    neworder: newOrder,
    trades: pasttrades
};
