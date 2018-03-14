'use strict';

var app = angular.module('app', []);

app.controller('balancesController', function ($scope, $http, $rootScope, $q) {
  $scope.ico = 28.86;
  $scope.billy = -5;
  $scope.total_quoine = 0;
  $scope.total_qryptos = 0;
  $scope.total_bitfinex = 0;
  $scope.total_poloniex = 0;
  $scope.total_binance = 0;

  $scope.total_usd = 0;

  $scope.total_exchange = 0;
  $scope.$watch('total_quoine', function () {
    $scope.total_exchange += $scope.total_quoine;
  });
  $scope.$watch('total_qryptos', function () {
    $scope.total_exchange += $scope.total_qryptos;
  });
  $scope.$watch('total_bitfinex', function () {
    $scope.total_exchange += $scope.total_bitfinex;
  });
  $scope.$watch('total_poloniex', function () {
    $scope.total_exchange += $scope.total_poloniex;
  });
  $scope.$watch('total_binance', function () {
    $scope.total_exchange += $scope.total_binance;
  });

  let quoine = $http.get('balances/quoinex');
  let qryptos = $http.get('balances/qryptos');
  let bitfinex = $http.get('balances/bitfinex');
  let poloniex = $http.get('balances/poloniex');
  let binance = $http.get('balances/binance');

  let cmc = $http.get('ticker/cmc');
  let na = $http.get('ticker/na');

  $q.all({
    quoine,
    qryptos,
    bitfinex,
    poloniex,
    binance,
    cmc,
    na
  }).then(r => {
    console.log(r);
    $scope.balance_quoinex = r.quoine.data.filter(item => item.balance > 0);

    $scope.balance_qryptos = r.qryptos.data.filter(item => item.balance > 0);

    $scope.balance_bitfinex = r.bitfinex.data
      .filter(item => item.type == 'exchange')
      .filter(item => item.amount > 0)
      .map(item => {
        return {
          currency: item.currency.toUpperCase(),
          balance: item.amount
        }
      });

    $scope.balance_poloniex = Object.keys(r.poloniex.data)
      .map(item => {
        return {
          currency: item,
          balance: parseFloat(r.poloniex.data[item].available) + parseFloat(r.poloniex.data[item].onOrders)
        }
      })
      .filter(item => item.balance > 0);

    $scope.balance_binance = r.binance.data.balances
      .filter(item => item.free > 0)
      .map(item => {
        return {
          currency: item.asset,
          balance: parseFloat(item.free) + parseFloat(item.locked)
        }
      });

    $scope.ticker = r.cmc.data;
    $scope.ticker_na = r.na.data;

    $scope.total_ico = $scope.ico * r.cmc.data.ETH.price;
    $scope.total_billy = $scope.billy * r.cmc.data.ETH.price;

    $scope.total_usd = parseFloat($scope.balance_quoinex.find(i => i.currency == "USD").balance) +
      parseFloat($scope.balance_quoinex.find(i => i.currency == "USD").balance) +
      parseFloat($scope.balance_bitfinex.find(i => i.currency == "USD").balance) +
      // parseFloat($scope.balance_poloniex.find(i => i.currency == "USDT").balance) +
      parseFloat($scope.balance_binance.find(i => i.currency == "USDT").balance);
  });
});
