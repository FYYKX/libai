var express = require('express');
var async = require('async');
var BigNumber = require('bignumber.js');
var router = express.Router();

router.get('/:exchange/:side/:pair/:price/:amount', function (req, res) {
    var exchange = require('./exchange/' + req.params.exchange);
    var price = parseFloat(req.params.price);

    exchange.neworder(req.params.amount, price.toString(), req.params.side, req.params.pair, function (body) {
        res.json(body);
    });
});

router.post('/batch', function (req, res) {
    var exchange = require('./exchange/' + req.body.exchange);
    var product_id = req.body.product_id;
    var interval = new BigNumber(req.body.interval);
    var unit = req.body.unit;
    var side = req.body.side;
    var price = new BigNumber(req.body.price);
    var amount = req.body.amount;

    if (side == "sell") {
        interval = interval.multipliedBy(-1);
    }
    var quotient = Math.floor(amount / unit);
    var remainder = amount % unit;
    var orders = [];
    for (let index = 0; index < quotient; index++) {
        orders.push(price.toFormat(8));
        price = price.plus(interval);
    }

    async.everySeries(orders, function (price, callback) {
        console.log(product_id + "" + unit + "" + price + "" + side);
        exchange.neworder(product_id, unit, price, side, function (response) {
            if (response.errors) {
                console.log(response.errors);
                callback(null);
            } else {
                console.log(side + " " + price + " " + unit + " " + response.currency_pair_code);
                callback(null, price);
            }
        });
    }, function (err, result) {
        res.sendStatus(200);
    });
});

module.exports = router;
