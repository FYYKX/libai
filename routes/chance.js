var request = require('request');
var async = require('async');
var _ = require('lodash');

var data = require('./data');

var ethereum = function (temp) {
    var check = true;
    temp.forEach(function (item) {
        if (item.usd < 20) {
            if (item.asks) {
                item.asks.price = 1000;
            } else {
                check = false;
            }
        }
        if (item.ethereum < 0.05) {
            if (item.bids) {
                item.bids.price = 0.01;
            } else {
                check = false;
            }
        }
    });

    if (check) {
        //low asks_exchange is the exchange where we want to buy
        var buy = _.minBy(temp, 'asks.price');
        //high bids_exchange is the exchange where we want to sellF
        var sell = _.maxBy(temp, 'bids.price');

        var asks_price = buy.asks.price;
        var bids_price = sell.bids.price;

        var percentage = (bids_price - asks_price) / bids_price;
        //0.15 because 0.1 makes the order maker and 0.05 for fees
        var potentialBuyPrice = asks_price + 0.15;

        var possibleSellVolume = sell.ethereum;
        var possibleBuyVolume = buy.usd / potentialBuyPrice;

        var possibleVolume = possibleBuyVolume > possibleSellVolume ? possibleSellVolume : possibleBuyVolume;

        var time = Date.now();

        // if (percentage > (0 - 100)) {
        if (percentage > (0.012)) {
            return {
                time,
                data: {
                    buy,
                    sell,
                    percentage,
                    possibleVolume
                }
            };
        }
    }
    return {};
};

var book = function (callback) {
    var temp = [];

    async.parallel([
            //bitfinex
            function (callback) {
                var url = "https://api.bitfinex.com/v1";
                var payload = {
                    "limit_bids": 1,
                    "limit_asks": 1,
                    "group": 1
                };
                var options = {
                    url: url + '/book/ethusd',
                    qs: payload
                };
                request.get(options, function (error, response, body) {
                    if (!error && response.statusCode === 200) {
                        var data = JSON.parse(body);
                        temp[0] = {
                            asks: {
                                price: parseFloat(data.asks[0].price),
                                amount: parseFloat(data.asks[0].amount)
                            },
                            bids: {
                                price: parseFloat(data.bids[0].price),
                                amount: parseFloat(data.bids[0].amount)
                            }
                        };
                    }
                    callback();
                });
            },

            //poloniex
            function (callback) {
                var url = "https://poloniex.com/public?command=returnOrderBook&currencyPair=USDT_ETH&depth=1";
                request.get(url, function (error, response, body) {
                    if (!error && response.statusCode === 200) {
                        var data = JSON.parse(body);
                        temp[1] = {
                            asks: {
                                price: parseFloat(data.asks[0][0]),
                                amount: data.asks[0][1]
                            },
                            bids: {
                                price: parseFloat(data.bids[0][0]),
                                amount: data.bids[0][1]
                            }
                        };
                    }
                    callback();
                });
            },

            //quoinex
            function (callback) {
                var url = 'https://api.quoine.com/products/27/price_levels';
                request.get(url, function (error, response, body) {
                    if (!error && response.statusCode === 200) {
                        var data = JSON.parse(body);
                        temp[2] = {
                            asks: {
                                price: parseFloat(data.sell_price_levels[0][0]),
                                amount: parseFloat(data.sell_price_levels[0][1])
                            },
                            bids: {
                                price: parseFloat(data.buy_price_levels[0][0]),
                                amount: parseFloat(data.buy_price_levels[0][1])
                            }
                        };
                    }
                    callback();
                });
            }
        ],
        function (err, results) {
            callback(_.merge(temp, data.findAll()));
        });
};

module.exports = {
    ethereum: ethereum,
    book: book
};