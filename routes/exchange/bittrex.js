var request = require('request');
var crypto = require('crypto');

var config = require('../../config');

var
    api_key = config.bittrex.api_key,
    api_secret = config.bittrex.api_secret,
    baseRequest = request.defaults({
        headers: {
            'Key': api_key
        },
        baseUrl: 'https://bittrex.com/api/v1.1',
        json: true
    });

function getOptions(method) {
    var nonce = Date.now() / 1000;
    nonce = 1533231597;
    var path = method + "?apikey=" + api_key + "&nonce=" + nonce;
    var uri = "https://bittrex.com/api/v1.1" + path;
    var sign = crypto.createHmac('sha512', api_secret).update(uri).digest('hex');
    return {
        url: path,
        headers: {
            'apisign': sign
        }
    };
}

var balances = function (callback) {
    var method = "/account/getbalances";
    var options = getOptions(method);
    console.log(options);
    baseRequest.post(options, function (error, response, body) {
        console.log
        callback(body);
    });
};

module.exports = {
    balances: balances
};
