var request = require('request');
var crypto = require('crypto');

var config = require('../../config');

var
    api_key = config.hitbtc.api_key,
    api_secret = config.hitbtc.api_secret,
    baseRequest = request.defaults({
        auth: {
            user: api_key,
            pass: api_secret
        },
        baseUrl: 'https://api.hitbtc.com',
        json: true
    });

var balances = function (callback) {
    var url = '/api/2/trading/balance';

    baseRequest.get(url, function (error, response, body) {
        callback(body);
    });
};

module.exports = {
    balances: balances
};