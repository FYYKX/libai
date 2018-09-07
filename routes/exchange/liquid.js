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
    baseUrl: 'https://api.liquid.com'
  });

function getOptions(verb, url, payload) {
  payload.nonce = Date.now();
  payload.token_id = token_id;

  var signature = jwt.sign(payload, user_secret);
  var body = '';

  if (verb == 'PUT' || verb == 'POST') {
    body = JSON.stringify(payload);
  }

  return {
    url: url,
    headers: {
      'X-Quoine-Auth': signature
    },
    body: body
  };
}

var balances = function (callback) {
  var verb = 'GET';
  var url = '/accounts/balance';
  var payload = {
    'path': url
  };

  var options = getOptions(verb, url, payload);

  baseRequest.get(options, function (error, response, body) {
    callback(JSON.parse(body));
  });
};

var executions = function (product_id, callback) {
  var verb = 'GET';
  var url = '/executions/me?product_id=' + product_id;
  var payload = {
    'path': url
  };

  var options = getOptions(verb, url, payload);
  baseRequest.get(options, function (error, response, body) {
    callback(JSON.parse(body));
  });
};

var liveorders = function (callback) {
  var verb = 'GET';
  var url = '/orders?status=live';
  var payload = {
    'path': url
  };

  var options = getOptions(verb, url, payload);

  baseRequest.get(options, function (error, response, body) {
    callback(JSON.parse(body));
  });
};

var filledorders = function (callback) {
  var verb = 'GET';
  var url = '/orders?status=filled';
  var payload = {
    'path': url
  };

  var options = getOptions(verb, url, payload);

  baseRequest.get(options, function (error, response, body) {
    callback(JSON.parse(body));
  });
};

var createOrder = function (product_id, amount, price, side, callback) {
  var verb = 'PUT';
  var url = '/orders/';
  var payload = {
    'path': url,
    'order': {
      'order_type': 'limit',
      'product_id': product_id,
      'side': side,
      'quantity': amount,
      'price': price
    }
  };

  var options = getOptions(verb, url, payload);

  baseRequest.post(options, function (error, response, body) {
    callback(JSON.parse(body));
  });
};

var cancelOrder = function (id, callback) {
  var verb = 'GET';
  var url = '/orders/' + id + '/cancel';
  var payload = {
    'path': url
  };

  var options = getOptions(verb, url, payload);

  baseRequest.put(options, function (error, response, body) {
    callback(JSON.parse(body));
  });
};

module.exports = {
  balances: balances,
  trades: executions,
  liveorders: liveorders,
  filledorders: filledorders,
  neworder: createOrder,
  cancelorder: cancelOrder
};
