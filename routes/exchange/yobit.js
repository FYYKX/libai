var request = require('request');
var crypto = require('crypto');
var formurlencoded = require('form-urlencoded');

var config = require('../../config');

var
  api_key = config.yobit.api_key,
  api_secret = config.yobit.api_secret,
  baseRequest = request.defaults({
    headers: {
      'Key': api_key
    },
    baseUrl: 'https://yobit.net',
    json: true
  });

function getOptions(payload) {
  payload.nonce = parseInt(Date.now() / 1000);
  var data = formurlencoded(payload);
  var signature = crypto.createHmac('sha512', api_secret).update(data).digest('hex');
  return {
    url: "/tapi",
    headers: {
      'Sign': signature
    },
    form: payload
  };
}

var balances = function (callback) {
  var payload = {
    'method': 'getInfo'
  };

  var options = getOptions(payload);

  baseRequest.post(options, function (error, response, body) {
    callback(body);
  });
};

module.exports = {
  balances: balances
};
