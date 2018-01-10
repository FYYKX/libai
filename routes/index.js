var express = require('express');
var async = require('async');
var request = require('request');
var router = express.Router();

router.get('/', function (req, res) {
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

router.get('/exchange', function (req, res) {
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

module.exports = router;