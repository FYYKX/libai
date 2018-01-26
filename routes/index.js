var express = require('express');
var async = require('async');
var request = require('request');
var router = express.Router();

router.get('/bitfinex', function (req, res) {
  res.render('index');
});

router.get('/eth', function (req, res) {
  res.render('eth');
});

router.get('/btc', function (req, res) {
  res.render('btc');
});

router.get('/qash', function (req, res) {
  res.render('qash');
});

router.get(['/', '/exchange'], function (req, res) {
  res.render('exchange');
});

router.get('/ticker/poloniex', function (req, res) {
  request.get({
    url: 'https://poloniex.com/public?command=returnTicker',
    json: true
  }, function (error, response, body) {
    res.json(body);
  });
});

router.get('/ticker/binance', function (req, res) {
  request.get({
    url: 'https://api.binance.com/api/v1/ticker/allPrices',
    json: true
  }, function (error, response, body) {
    res.json(body);
  });
});

router.get('/ticker/cmc', function (req, res) {
  request.get({
    url: 'https://api.coinmarketcap.com/v1/ticker/',
    json: true
  }, function (error, response, body) {
    res.json(body.reduce((o, a) =>
      Object.assign(o,
        {
          [a.symbol]: {
            price: a.price_usd,
            percent_change_24h: a.percent_change_24h
          }
        }), {}));
  });
});

router.get('/ticker/na', function (req, res) {
  async.parallel({
    LRC: function (callback) {
      request.get({
        url: "https://api.coinmarketcap.com/v1/ticker/loopring/",
        json: true,
      }, function (error, response, body) {
        var data = body[0];
        data.price = parseFloat(data.price_usd);
        callback(null, data);
      });
    },
    STORJ: function (callback) {
      request.get({
        url: "https://api.coinmarketcap.com/v1/ticker/storj/",
        json: true
      }, function (error, response, body) {
        var data = body[0];
        data.price = parseFloat(data.price_usd);
        callback(null, data);
      });
    },
    GTO: function (callback) {
      request.get({
        url: "https://api.coinmarketcap.com/v1/ticker/gifto/",
        json: true
      }, function (error, response, body) {
        var data = body[0];
        data.price = parseFloat(data.price_usd);
        callback(null, data);
      });
    },
    DLT: function (callback) {
      request.get({
        url: "https://api.coinmarketcap.com/v1/ticker/agrello-delta/",
        json: true
      }, function (error, response, body) {
        var data = body[0];
        data.price = parseFloat(data.price_usd);
        callback(null, data);
      });
    },
    POE: function (callback) {
      request.get({
        url: "https://api.coinmarketcap.com/v1/ticker/poet/",
        json: true
      }, function (error, response, body) {
        var data = body[0];
        data.price = parseFloat(data.price_usd);
        callback(null, data);
      });
    },
    QSP: function (callback) {
      request.get({
        url: "https://api.coinmarketcap.com/v1/ticker/quantstamp/",
        json: true
      }, function (error, response, body) {
        var data = body[0];
        data.price = parseFloat(data.price_usd);
        callback(null, data);
      });
    },
    YOYO: function (callback) {
      request.get({
        url: "https://api.coinmarketcap.com/v1/ticker/yoyow/",
        json: true
      }, function (error, response, body) {
        var data = body[0];
        data.price = parseFloat(data.price_usd);
        callback(null, data);
      });
    },
    EVX: function (callback) {
      request.get({
        url: "https://api.coinmarketcap.com/v1/ticker/everex/",
        json: true
      }, function (error, response, body) {
        var data = body[0];
        data.price = parseFloat(data.price_usd);
        callback(null, data);
      });
    },
    INS: function (callback) {
      request.get({
        url: "https://api.coinmarketcap.com/v1/ticker/ins-ecosystem/",
        json: true
      }, function (error, response, body) {
        var data = body[0];
        data.price = parseFloat(data.price_usd);
        callback(null, data);
      });
    },
    SUB: function (callback) {
      request.get({
        url: "https://api.coinmarketcap.com/v1/ticker/substratum/",
        json: true
      }, function (error, response, body) {
        var data = body[0];
        data.price = parseFloat(data.price_usd);
        callback(null, data);
      });
    }
  }, function (err, results) {
    res.json(results);
  });
});

module.exports = router;