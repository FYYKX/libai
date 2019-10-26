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
    url: 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest',
    headers: {
      'X-CMC_PRO_API_KEY': 'ed6337a4-3f5e-4512-9fd3-85014d28a744'
    },
    json: true
  }, function (error, response, body) {
    res.json(body.data.reduce((o, a) =>
      Object.assign(o, {
        [a.symbol]: {
          price: a.quote.USD.price,
          percent_change_24h: a.quote.USD.percent_change_24h
        }
      }), {})
    );
  });
});

router.get('/ticker/na', function (req, res) {
  request.get({
    url: 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest',
    qs: {
      'symbol': 'LRC,STORJ,GTO,DLT,POE,QSP,EVX,INS,SUB,BCPT,BKX,INS,CRPT,CHSB,LATX,DENT,POWR,NCASH,ENJ,NXT,NEC,VET,QASH,MEETONE,IQ,WIN'
    },
    headers: {
      'X-CMC_PRO_API_KEY': 'ed6337a4-3f5e-4512-9fd3-85014d28a744'
    },
    json: true,
    gzip: true
  }, function (error, response, body) {
    Object.keys(body.data)
      .map(function (k, v) {
        body.data[k].price = body.data[k].quote.USD.price;
        body.data[k].percent_change_24h = body.data[k].quote.USD.percent_change_24h;
      })
    res.json(body.data)
  });
});

module.exports = router;
