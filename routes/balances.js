var express = require('express');
var router = express.Router();

var bitfinex = require('./exchange/bitfinex');
var poloniex = require('./exchange/poloniex');
var quoinex = require('./exchange/quoinex');
var qryptos = require('./exchange/qryptos');

var data = require('./data');
var async = require('async');
var _ = require('lodash/core');

router.get('/qqbp', function (req, res) {
  async.parallel([
    function (callback) {
      quoinex.balances(function (body) {
        var data = {
          "exchange": "quoine",
          "usd": body.find(item => item.currency === "USD").balance,
          "sgd": body.find(item => item.currency === "SGD").balance,
          "eth": body.find(item => item.currency === "ETH").balance,
          "qash": body.find(item => item.currency === "QASH").balance,
          "btc": body.find(item => item.currency === "BTC").balance
        };
        callback(null, data);
      });
    },
    function (callback) {
      qryptos.balances(function (body) {
        var data = {
          "exchange": "qryptos",
          "usd": 0,
          "sgd": 0,
          "eth": body.find(item => item.currency === "ETH").balance,
          "qash": body.find(item => item.currency === "QASH").balance,
          "btc": body.find(item => item.currency === "BTC").balance
        };
        callback(null, data);
      });
    },
    function (callback) {
      bitfinex.balances(function (body) {
        var data = {
          "exchange": "bitfinex",
          "usd": 0,
          "sgd": 0,
          "eth": body.find(item => item.currency === "eth").amount,
          "qash": body.find(item => item.currency === "qsh").amount,
          "btc": body.find(item => item.currency === "btc").amount
        };
        callback(null, data);
      });
    },
    function (callback) {
      poloniex.balances(function (body) {
        var data = {
          "exchange": "poloniex",
          "usd": body.USDT,
          "sgd": 0,
          "eth": body.ETH,
          "qash": 0,
          "btc": body.BTC
        };
        callback(null, data);
      });
    }
  ],
    function (error, results) {
      res.json(results);
    });
});

router.get('/qq', function (req, res) {
  async.parallel([
    function (callback) {
      quoinex.balances(function (body) {
        var data = {
          "exchange": "quoine",
          "eth": body.find(item => item.currency === "ETH").balance,
          "qash": body.find(item => item.currency === "QASH").balance,
          "btc": body.find(item => item.currency === "BTC").balance
        };
        callback(null, data);
      });
    },
    function (callback) {
      qryptos.balances(function (body) {
        var data = {
          "exchange": "qryptos",
          "eth": body.find(item => item.currency === "ETH").balance,
          "qash": body.find(item => item.currency === "QASH").balance,
          "btc": body.find(item => item.currency === "BTC").balance
        };
        callback(null, data);
      });
    }
  ],
    function (error, results) {
      res.json(results);
    });
});

router.get('/:exchange', function (req, res) {
  var exchange = require('./exchange/' + req.params.exchange);
  exchange.balances(function (body) {
    res.json(body);
  });
});

router.get('/', function (req, res) {
  async.parallel([
    function (callback) {
      bitfinex.balances(function (body) {
        var tempUsd = _.find(body, {
          'type': 'exchange',
          'currency': 'usd'
        });
        var tempBitcoin = _.find(body, {
          'type': 'exchange',
          'currency': 'btc'
        });
        var tempEthereum = _.find(body, {
          'type': 'exchange',
          'currency': 'eth'
        });
        var exchange = "bitfinex";
        var usd = parseFloat(tempUsd ? tempUsd.available : 0);
        var bitcoin = parseFloat(tempBitcoin ? tempBitcoin.available : 0);
        var ethereum = parseFloat(tempEthereum ? tempEthereum.available : 0);

        var value = {
          exchange,
          usd,
          bitcoin,
          ethereum
        };

        data.save(0, value);

        callback();
      });
    },
    function (callback) {
      poloniex.balances(function (body) {
        var exchange = "poloniex";
        var usd = parseFloat(body.USDT);
        var ethereum = parseFloat(body.ETH);

        var value = {
          exchange,
          usd,
          ethereum
        };

        data.save(1, value);

        callback();
      });
    },
    function (callback) {
      quoinex.balances(function (body) {
        var exchange = "quoinex";
        var tempUsd = _.find(body, {
          'currency': 'USD'
        });
        var tempEthereum = _.find(body, {
          'currency': 'ETH'
        });
        var usd = parseFloat(tempUsd ? tempUsd.balance : 0);
        var ethereum = parseFloat(tempEthereum ? tempEthereum.balance : 0);

        var value = {
          exchange,
          usd,
          ethereum
        };

        data.save(2, value);

        callback();
      });
    }
  ],
    function () {
      res.json(data.findAll());
    });
});

module.exports = router;
