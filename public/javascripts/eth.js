'use strict';

var app = angular.module('app', []);

app.controller('balancesController', function ($scope, $http, $rootScope) {
    var data = function () {
        $scope.total_usd = 0;
        $scope.total_ethereum = 0;

        $http.get('balances')
            .then(function (response) {
                $scope.balances = response.data;
                $rootScope.$broadcast("balances:loaded", true);
            }, function (response) {
                console.log(response);
            });
    };

    data();

    $scope.loadBalance = data;
});

app.controller('bookController', function ($scope, $http) {
    var chances = [];
    var stop = false;
    $scope.count = 0;
    $scope.$on('balances:loaded', function () {
        $scope.balances = true;
    });

    var start = function () {
        return $http.get('book/chance')
            .then(function (response) {
                $scope.count++;
                if (response.data.time) {
                    var last = chances[chances.length - 1];
                    if (chances.length === 0 || !angular.equals(response.data.data, last.data)) {
                        $('audio')[0].play();
                        chances.push(response.data);
                        if (chances.length > 10) {
                            chances.shift();
                        }
                        $scope.chances = chances;
                    }
                }
                if (!stop) {
                    return start();
                }
            }, function (response) {
                $scope.count++;
                console.log(response);
                if (!stop) {
                    return start();
                }
            });
    };

    $scope.start = function () {
        stop = false;
        return start();
    };

    $scope.stop = function () {
        stop = true;
    };

    $scope.clear = function () {
        chances = [];
        $scope.chances = [];
        $scope.count = 0;
    };

    $scope.newOrder = function (index) {
        var data = $scope.chances[index].data;
        var buy_exchange = data.buy.exchange;
        var buy_price = data.buy.asks.price;
        var sell_exchange = data.sell.exchange;
        var sell_price = data.sell.bids.price;
        var amount = data.possibleVolume;
        var pair = 'eth';
        if (confirm("Buy from " + buy_exchange + " at price: " + buy_price + " and amount: " + amount + "\n"
                + "Sell from " + sell_exchange + " at price: " + sell_price + " and amount: " + amount + "\n"
                + "Profit Percentage is : " + ((sell_price - buy_price) / sell_price))) {
            // amount, price, side, pair,
            //new buy order
            $http.get('neworder/' + buy_exchange + '/buy/' + pair + '/' + buy_price + '/' + amount)
                .then(function (response) {
                    console.log(response);
                });

            //new sell order
            $http.get('neworder/' + sell_exchange + '/sell/' + pair + '/' + sell_price + '/' + amount)
                .then(function (response) {
                    console.log(response);
                });
        }
    };

    $scope.loadBook = function () {
        $scope.total_usd = 0;
        $scope.total_ethereum = 0;

        $http.get('book/ethereum')
            .then(function (response) {
                $scope.books = response.data;
            }, function (response) {
                console.log(response);
            });
    };
});

app.controller('orderController', function ($scope, $http) {
    $scope.loadOrder = function () {
        $http.get('liveorders/bitfinex')
            .then(function (response) {
                $scope.bitfinex_orders = response.data;
            });
        $http.get('liveorders/poloniex')
            .then(function (response) {
                $scope.poloniex_orders = response.data;
            });
        $http.get('liveorders/quoinex')
            .then(function (response) {
                $scope.quoinex_orders = response.data.models;
            });
    };
    $scope.cancelOrder = function (exchange, index) {
        switch (exchange) {
            case 'bitfinex':
                var bitfinex_id = $scope.bitfinex_orders[index].id;
                $http.get('cancelorder/bitfinex/' + bitfinex_id)
                    .then(function () {
                        $scope.bitfinex_orders.splice(index, 1);
                    });
                break;
            case 'poloniex':
                var poloniex_id = $scope.poloniex_orders[index].orderNumber;
                $http.get('cancelorder/poloniex/' + poloniex_id)
                    .then(function () {
                        $scope.poloniex_orders.splice(index, 1);
                    });
                break;
            case 'quoinex':
                var quoinex_id = $scope.quoinex_orders[index].id;
                $http.get('cancelorder/quoinex/' + quoinex_id)
                    .then(function () {
                        $scope.quoinex_orders.splice(index, 1);
                    });
                break;
        }
    };
});

app.controller('tradeController', function ($scope, $http) {
    $scope.loadTrades = function () {
        $http.get('trades/bitfinex')
            .then(function (response) {
                $scope.bitfinex_trades = response.data;
            });
        $http.get('trades/poloniex')
            .then(function (response) {
                $scope.poloniex_trades = response.data;
            });
        $http.get('trades/quoinex')
            .then(function (response) {
                $scope.quoinex_trades = response.data.models;
            });
    };
});