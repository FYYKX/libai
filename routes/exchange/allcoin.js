var request = require('request');
var crypto = require('crypto');
var config = require('../../config');

var
    api_key = config.allcoin.api_key,
    api_secret = config.allcoin.api_secret,
    baseRequest = request.defaults({
        baseUrl: 'https://www.allcoin.com/',
        json: true
    });

function getOptions(url) {
    var data = "api_key=" + api_key + "&secret_key=" + api_secret;
    var sign = crypto.createHash('md5').update(data).digest('hex');
    return {
        url: url + "?api_key=" + api_key + "&sign=" + sign
    };
}

var balances = function (callback) {
    var url = "/Api_User/userBalance";
    var options = getOptions(url);

    baseRequest.post(options, function (error, response, body) {
        callback(body);
    });
};

module.exports = {
    balances: balances
};
