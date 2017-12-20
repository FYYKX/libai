var express = require('express');
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

module.exports = router;