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

router.get('/qqbp', function (req, res) {
    res.render('qqbp');
});

router.get('/ticker', function (req, res) {
    request.get({
        url: 'https://poloniex.com/public?command=returnTicker',
        json: true
    }, function (error, response, body) {
        res.json(body);
    });
});

module.exports = router;