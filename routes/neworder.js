var express = require('express');
var router = express.Router();

router.get('/:exchange/:side/:pair/:price/:amount', function (req, res) {
    var exchange = require('./exchange/' + req.params.exchange);
    var price = parseFloat(req.params.price);

    exchange.neworder(req.params.amount, price.toString(), req.params.side, req.params.pair, function (body) {
        res.json(body);
    });
});

module.exports = router;
