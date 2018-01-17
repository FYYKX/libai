var request = require('request');
var jwt = require('jsonwebtoken');

var config = require('../../config');

var
  token_id = config.quoine.token_id,
  user_secret = config.quoine.user_secret,
  baseRequest = request.defaults({
    headers: {
      'Content-Type': 'application/json',
      'X-Quoine-API-Version': '2'
    },
    baseUrl: 'https://api.qryptos.com',
    json: true
  });

function getOptions(url, payload) {
  var signature = jwt.sign(payload, user_secret);
  var body = '';

  return {
    url: url,
    headers: {
      'X-Quoine-Auth': signature
    },
    body: body
  };
}

var balances = function (callback) {
  var url = '/accounts/balance';
  var payload = {
    'path': url,
    'nonce': Date.now(),
    'token_id': token_id
  };

  var options = getOptions(url, payload);

  baseRequest.get(options, function (error, response, body) {
    callback(body);
  });
};

var executions = function (product_id, callback) {
  var url = '/executions/me?product_id=' + product_id + '&limit=5';
  var payload = {
    'path': url,
    'nonce': Date.now(),
    'token_id': token_id
  };

  var options = getOptions(url, payload);

  baseRequest.get(options, function (error, response, body) {
    callback(body);
  });
};

var orders = function (callback) {
  var verb = 'GET';
  var url = '/orders?status=live';
  var payload = {
    'path': url,
    'nonce': Date.now(),
    'token_id': token_id
  };

  var options = getOptions(url, payload);

  baseRequest.get(options, function (error, response, body) {
    callback(body);
  });
};

var createOrder = function (amount, price, side, callback) {
  var url = '/orders/';
  var payload = {
    'path': url,
    'nonce': Date.now(),
    'token_id': token_id,
    'order_type': 'limit',
    'product_id': product_id,
    'side': side,
    'quantity': amount,
    'price': price
  };

  var options = getOptions(url, payload);

  baseRequest.post(options, function (error, response, body) {
    callback(body);
  });
};

var cancelOrder = function (id, callback) {
  var url = '/orders/' + id + '/cancel';
  var payload = {
    'path': url,
    'nonce': Date.now(),
    'token_id': token_id
  };

  var options = getOptions(url, payload);

  baseRequest.put(options, function (error, response, body) {
    callback(body);
  });
};

module.exports = {
  balances: balances,
  trades: executions,
  liveorders: orders,
  neworder: createOrder,
  cancelorder: cancelOrder
};
