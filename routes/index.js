var express = require('express');
var router = express.Router();

router.get('/', function (req, res) {
    res.render('index');
});

router.get('/qash', function (req, res) {
    res.render('qash');
});

router.get('/qqbp', function (req, res) {
    res.render('qqbp');
});

module.exports = router;