'use strict';

var app = angular.module('app', []);

app.controller('balancesController', function ($scope, $http, $rootScope, $q) {
  $scope.ps = 0.5033;
  $scope.kx = 0.3355;
  $scope.wy = 0.1612;

  $scope.ico = 28.96;
  $scope.billy = -5;
  $scope.total_liquid = 0;
  $scope.total_bitfinex = 0;
  $scope.total_poloniex = 0;
  $scope.total_binance = 0;
  $scope.total_yobit = 0;
  $scope.total_hitbtc = 0;
  $scope.total_exmo = 0;
  $scope.total_bittrex = 0;
  $scope.total_allcoin = 0;

  $scope.total_ico = 0;

  $scope.total_usd = 0;

  $scope.total_exchange = 0;
  $scope.$watch('total_liquid', function () {
    $scope.total_exchange += $scope.total_liquid;
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
  $scope.$watch('total_exmo', function () {
    $scope.total_exchange += $scope.total_exmo;
  });
  $scope.$watch('total_bittrex', function () {
    $scope.total_exchange += $scope.total_bittrex;
  });
  $scope.$watch('total_allcoin', function () {
    $scope.total_exchange += $scope.total_allcoin;
  });

  let liquid = $http.get('balances/liquid');
  let bitfinex = $http.get('balances/bitfinex');
  let poloniex = $http.get('balances/poloniex');
  let binance = $http.get('balances/binance');
  let yobit = $http.get('balances/yobit');
  let hitbtc = $http.get('balances/hitbtc');
  let exmo = $http.get('balances/exmo');
  let bittrex = $http.get('balances/bittrex');

  let ico = $http.get('balances/ico');

  let cmc = $http.get('ticker/cmc');
  let na = $http.get('ticker/na');

  $q.all({
    liquid,
    bitfinex,
    poloniex,
    binance,
    yobit,
    hitbtc,
    exmo,
    bittrex,
    ico,
    cmc,
    na
  }).then(r => {
    $scope.balance_liquid = r.liquid.data
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

    $scope.balance_exmo = Object.keys(r.exmo.data.balances)
      .map(item => {
        return {
          currency: item.toUpperCase(),
          balance: parseFloat(r.exmo.data.balances[item]) + parseFloat(r.exmo.data.reserved[item])
        }
      })
      .filter(item => item.balance > 0);

    $scope.balance_bittrex = r.bittrex.data.result
      .map(item => {
        return {
          currency: item.Currency,
          balance: item.Balance
        }
      })
      .filter(item => item.balance > 0);

    $scope.balance_allcoin = [{
        currency: "ETH",
        balance: 9.8843
      },
      {
        currency: "BTC",
        balance: 0.0016
      }
    ];

    $scope.balance_ico = r.ico.data;
    $scope.cost_ico = $scope.ico * r.cmc.data.ETH.price;
    for (var key in r.na.data) {
      r.cmc.data[key] = r.na.data[key];
    }

    var fix = {
      "AUD": 0.72,
      "USD": 1,
      "SGD": 0.73,
      "GZE": 0,
      "PWV": 0,
      "EVT": 0,
      "FANZ": 0,
      "ADD": 0,
      "ATD": 0,
      "IQX": 0,
      "MTO": 0,
      "EOP": 0,
      "EON": 0,
      "CHI": 0,
      "ETCV": 0 
    };
    for (var key in fix) {
      r.cmc.data[key] = {
        price: fix[key],
        percent_change_24h: "0"
      };
    }

    r.cmc.data.IOT = r.cmc.data.MIOTA;
    r.cmc.data.QSH = r.cmc.data.QASH;
    r.cmc.data.QTM = r.cmc.data.QTUM;
    r.cmc.data.STR = r.cmc.data.XLM;
    r.cmc.data.BAB = r.cmc.data.BCH;
    r.cmc.data.BCHABC = r.cmc.data.BCH;
    r.cmc.data.BCHSV = r.cmc.data.BSV;

    $scope.ticker = r.cmc.data;
    $scope.ticker_na = r.na.data;
    $scope.total_billy = $scope.billy * r.cmc.data.ETH.price;

    $scope.total_usd =
      parseFloat($scope.balance_liquid.find(i => i.currency == "USD").balance) +
      parseFloat($scope.balance_bitfinex.find(i => i.currency == "USD").balance) +
      parseFloat($scope.balance_poloniex.find(i => i.currency == "USDT").balance) +
      parseFloat($scope.balance_yobit.find(i => i.currency == "USD").balance);
  });
});
