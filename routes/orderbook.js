var request = require('request');
var async = require('async');

var product = function(quoineID, qryptosID, callback) {
  async.parallel([
      function(callback) {
        request.get({
          url: "https://api.quoine.com/products/" + quoineID + "/price_levels",
          json: true,
        }, function(error, response, body) {
          try {
            callback(null, {
              "exchange": "quoine",
              "bid": parseFloat(body.buy_price_levels[0][0]),
              "bid_amount": parseFloat(body.buy_price_levels[0][1]),
              "ask": parseFloat(body.sell_price_levels[0][0]),
              "ask_amount": parseFloat(body.sell_price_levels[0][1])
            });
          } catch (e) {
            return callback(e);
          }
        });
      },
      function(callback) {
        request.get({
          url: "https://api.qryptos.com/products/" + qryptosID + "/price_levels",
          json: true
        }, function(error, response, body) {
          try {
            callback(null, {
              "exchange": "qryptos",
              "bid": parseFloat(body.buy_price_levels[0][0]),
              "bid_amount": parseFloat(body.buy_price_levels[0][1]),
              "ask": parseFloat(body.sell_price_levels[0][0]),
              "ask_amount": parseFloat(body.sell_price_levels[0][1])
            });
          } catch (e) {
            return callback(e);
          }
        });
      }
    ],
    function(err, results) {
      callback(results);
    }
  );
};

module.exports = {
  product: product
};
