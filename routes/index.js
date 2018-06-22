var express = require('express');
var async = require('async');
var request = require('request');
var router = express.Router();

router.get('/bitfinex', function (req, res) {
  res.render('bitfinex');
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

router.get('/qryptos', function (req, res) {
  res.render('qryptos');
});

router.get('/order', function (req, res) {
  res.render('order');
});

router.get(['/', '/exchange'], function (req, res) {
  res.render('exchange');
});

router.get('/products', function (req, res) {
  request.get({
    url: 'https://api.qryptos.com/products',
    json: true
  }, function (error, response, body) {
    res.json(body);
  });
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
      Object.assign(o, {
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
    },
    BCPT: function (callback) {
      request.get({
        url: "https://api.coinmarketcap.com/v1/ticker/blockmason/",
        json: true
      }, function (error, response, body) {
        var data = body[0];
        data.price = parseFloat(data.price_usd);
        callback(null, data);
      });
    },
    BKX: function (callback) {
      request.get({
        url: "https://api.coinmarketcap.com/v1/ticker/bankex/",
        json: true,
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
    CRPT: function (callback) {
      request.get({
        url: "https://api.coinmarketcap.com/v1/ticker/crypterium/",
        json: true
      }, function (error, response, body) {
        var data = body[0];
        data.price = parseFloat(data.price_usd);
        callback(null, data);
      });
    },
    CHSB: function (callback) {
      request.get({
        url: "https://api.coinmarketcap.com/v1/ticker/swissborg/",
        json: true
      }, function (error, response, body) {
        var data = body[0];
        data.price = parseFloat(data.price_usd);
        callback(null, data);
      });
    },
    LATX: function (callback) {
      request.get({
        url: "https://api.coinmarketcap.com/v1/ticker/latiumx/",
        json: true
      }, function (error, response, body) {
        var data = body[0];
        data.price = parseFloat(data.price_usd);
        callback(null, data);
      });
    },
    DENT: function (callback) {
      request.get({
        url: "https://api.coinmarketcap.com/v1/ticker/dent/",
        json: true
      }, function (error, response, body) {
        var data = body[0];
        data.price = parseFloat(data.price_usd);
        callback(null, data);
      });
    },
    POWR: function (callback) {
      request.get({
        url: "https://api.coinmarketcap.com/v1/ticker/power-ledger/",
        json: true
      }, function (error, response, body) {
        var data = body[0];
        data.price = parseFloat(data.price_usd);
        callback(null, data);
      });
    },
    NCASH: function (callback) {
      request.get({
        url: "https://api.coinmarketcap.com/v1/ticker/nucleus-vision/",
        json: true
      }, function (error, response, body) {
        var data = body[0];
        data.price = parseFloat(data.price_usd);
        callback(null, data);
      });
    },
    ENJ: function (callback) {
      request.get({
        url: "https://api.coinmarketcap.com/v1/ticker/enjin-coin/",
        json: true
      }, function (error, response, body) {
        var data = body[0];
        data.price = parseFloat(data.price_usd);
        callback(null, data);
      });
    },
    NXT: function (callback) {
      request.get({
        url: "https://api.coinmarketcap.com/v1/ticker/nxt/",
        json: true
      }, function (error, response, body) {
        var data = body[0];
        data.price = parseFloat(data.price_usd);
        callback(null, data);
      });
    },
    NEC: function (callback) {
      request.get({
        url: "https://api.coinmarketcap.com/v1/ticker/nectar/",
        json: true
      }, function (error, response, body) {
        var data = body[0];
        data.price = parseFloat(data.price_usd);
        callback(null, data);
      });
    },
    EON: function (callback) {
      var data = {
        price: 0
      };
      callback(null, data);
    }
  }, function (err, results) {
    res.json(results);
  });
});

module.exports = router;
