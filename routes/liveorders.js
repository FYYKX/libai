var express = require('express');
var router = express.Router();

router.get('/:exchange', function (req, res) {
    var exchange = require('./exchange/' + req.params.exchange);
    exchange.liveorders(function (body) {
        res.json(body);
    });
});

router.get('/:exchange/filled', function (req, res) {
    var exchange = require('./exchange/' + req.params.exchange);
    exchange.filledorders(function (body) {
        res.json(body);
    });
});

module.exports = router;