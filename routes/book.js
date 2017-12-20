var express = require('express');
var router = express.Router();

var chance = require('./chance');
var orderbook = require('./orderbook');

router.get('/ethereum', function(req, res) {
  chance.book(function(data) {
    res.json(data);
  });
});

router.get('/chance', function(req, res) {
  chance.book(function(data) {
    res.json(chance.ethereum(data));
  });
});

router.get('/qash', function(req, res) {
  orderbook.product(51, 31, function(results) {
    var low = 0;
    results.forEach(function(item) {
      if (item) {
        if (low === 0 || item.ask < low) {
          low = item.ask;
        }
      }
    });
    res.json({
      ask: low,
      ticker: results
    });
  });
});

module.exports = router;
