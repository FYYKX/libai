'use strict';

var app = angular.module('app', []);

app.controller('balancesController', function ($scope, $http, $rootScope) {
  var data = function () {
    $scope.total_usd = 0;
    $scope.total_ethereum = 0;

    $http.get('balances/qqbp')
      .then(function (response) {
        $scope.balances = response.data;
      }, function (response) {
        console.log(response);
      });
  };

  data();

  $scope.loadBalance = data;
});

app.controller('bookController', function ($scope, $http) {
  $scope.loadBook = function () {
    $scope.total_usd = 0;
    $scope.total_ethereum = 0;

    $http.get('book/qash')
      .then(function (response) {
        var json = response.data;
        var ask = json.ask;
        var ticker = json.ticker;

        for (var i = 0, ien = ticker.length; i < ien; i++) {
          var percentage = (ticker[i].bid - ask) / ask;

          ticker[i].percentage = percentage;
          if (percentage > 0) {
            ticker[i].amount = ticker[i].bid_amount;
          } else {
            ticker[i].amount = ticker[i].ask_amount;
          }

          ticker[i].p = (percentage * 100).toFixed(2) + "%";

          ticker[i].spread = ticker[i].ask - ticker[i].bid;
          ticker[i].sp = ((ticker[i].spread / ticker[i].bid) * 100).toFixed(2) + "%";
        }
        $scope.books = ticker;
      }, function (response) {
        console.log(response);
      });
  };
});

app.controller('orderController', function ($scope, $http) {
  $scope.loadOrder = function () {
    $http.get('liveorders/quoinex')
      .then(function (response) {
        $scope.quoinex_orders = response.data.models;
      });
    $http.get('liveorders/qryptos')
      .then(function (response) {
        $scope.qryptos_orders = response.data.models;
      });
    $http.get('liveorders/bitfinex')
      .then(function (response) {
        $scope.bitfinex_orders = response.data;
      });
  };
  $scope.cancelOrder = function (exchange, index) {
    switch (exchange) {
      case 'quoine':
        var quoinex_id = $scope.quoinex_orders[index].id;
        $http.get('cancelorder/quoinex/' + quoinex_id)
          .then(function () {
            $scope.quoinex_orders.splice(index, 1);
          });
        break;
      case 'qryptos':
        var qryptos_id = $scope.qryptos_orders[index].id;
        $http.get('cancelorder/qryptos/' + qryptos_id)
          .then(function () {
            $scope.qryptos_orders.splice(index, 1);
          });
        break;
      case 'bitfinex':
        var bitfinex_id = $scope.bitfinex_orders[index].id;
        $http.get('cancelorder/bitfinex/' + bitfinex_id)
          .then(function () {
            $scope.bitfinex_orders.splice(index, 1);
          });
        break;
    }
  };
});

app.controller('tradeController', function ($scope, $http) {
  $scope.loadTrades = function () {
    $http.get('trades/quoinex/51')
      .then(function (response) {
        $scope.quoinex_trades = response.data.models;
      });
    $http.get('trades/qryptos/31')
      .then(function (response) {
        $scope.qryptos_trades = response.data.models;
      });
    $http.get('trades/bitfinex/QSHETH')
      .then(function (response) {
        $scope.bitfinex_trades = response.data;
      });
  };
});
