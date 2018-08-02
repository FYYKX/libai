'use strict';

var app = angular.module('app', []);

app.controller('balancesController', function ($scope, $http, $rootScope, $q) {
  $scope.ps = 0.5033;
  $scope.kx = 0.3355;
  $scope.wy = 0.1612;

  $scope.ico = 28.96;
  $scope.billy = -5;
  $scope.total_quoine = 0;
  $scope.total_qryptos = 0;
  $scope.total_bitfinex = 0;
  $scope.total_poloniex = 0;
  $scope.total_binance = 0;
  $scope.total_yobit = 0;
  $scope.total_hitbtc = 0;

  $scope.total_ico = 0;

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
  $scope.$watch('total_yobit', function () {
    $scope.total_exchange += $scope.total_yobit;
  });
  $scope.$watch('total_hitbtc', function () {
    $scope.total_exchange += $scope.total_hitbtc;
  });

  let quoine = $http.get('balances/quoinex');
  let qryptos = $http.get('balances/qryptos');
  let bitfinex = $http.get('balances/bitfinex');
  let poloniex = $http.get('balances/poloniex');
  let binance = $http.get('balances/binance');
  let yobit = $http.get('balances/yobit');
  let hitbtc = $http.get('balances/hitbtc');

  let ico = $http.get('balances/ico');

  let cmc = $http.get('ticker/cmc');
  let na = $http.get('ticker/na');

  $q.all({
    quoine,
    qryptos,
    bitfinex,
    poloniex,
    binance,
    yobit,
    hitbtc,
    ico,
    cmc,
    na
  }).then(r => {
    $scope.balance_quoinex = r.quoine.data.filter(item => item.balance > 0);

    $scope.balance_qryptos = r.qryptos.data
      .filter(item => item.balance > 0);

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

    $scope.balance_yobit = Object.keys(r.yobit.data.return.funds)
      .map(item => {
        return {
          currency: item.toUpperCase(),
          balance: r.yobit.data.return.funds[item]
        }
      })
      .filter(item => item.balance > 0);

    $scope.balance_hitbtc = r.hitbtc.data
      .filter(item => item.available > 0)
      .map(item => {
        return {
          currency: item.currency,
          balance: parseFloat(item.available) + parseFloat(item.reserved)
        }
      });

    $scope.balance_ico = r.ico.data;
    $scope.cost_ico = $scope.ico * r.cmc.data.ETH.price;
    for (var key in r.na.data) {
      r.cmc.data[key] = r.na.data[key];
    }

    var fix = {
      "AUD": 0.76,
      "USD": 1,
      "SGD": 0.75,
      "GZE": 0,
      "PWV": 0,
      "EVT": 0,
      "FANZ": 0,
      "ADD": 0,
      "ATD": 0,
      "IQX": 0,
      "MTO": 0,
      "MEETONE": 0,
      "EOP": 0,
      "IQ": 0,
      "EON": 0
    };
    for (var key in fix) {
      r.cmc.data[key] = {
        price: fix[key],
        percent_change_24h: "0"
      };
    }

    r.cmc.data.VET = r.cmc.data.VEN;
    r.cmc.data.IOT = r.cmc.data.MIOTA;
    r.cmc.data.QSH = r.cmc.data.QASH;
    r.cmc.data.QTM = r.cmc.data.QTUM;
    r.cmc.data.STR = r.cmc.data.XLM;

    $scope.ticker = r.cmc.data;

    $scope.ticker_na = r.na.data;

    $scope.total_billy = $scope.billy * r.cmc.data.ETH.price;

    $scope.total_usd = parseFloat($scope.balance_quoinex.find(i => i.currency == "USD").balance) +
      parseFloat($scope.balance_quoinex.find(i => i.currency == "USD").balance) +
      parseFloat($scope.balance_bitfinex.find(i => i.currency == "USD").balance) +
      parseFloat($scope.balance_poloniex.find(i => i.currency == "USDT").balance) +
      parseFloat($scope.balance_binance.find(i => i.currency == "USDT").balance) + 
      parseFloat($scope.balance_yobit.find(i => i.currency == "USD").balance) +
      parseFloat($scope.balance_hitbtc.find(i => i.currency == "USD").balance);
  });
});
