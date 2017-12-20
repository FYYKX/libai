var express = require('express');
var router = express.Router();

router.get('/:exchange/:order_id', function (req, res) {
    var exchange = require('./exchange/' + req.params.exchange);
    exchange.cancelorder(parseInt(req.params.order_id), function (body) {
        res.json(body);
    });
});
module.exports = router;