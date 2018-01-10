'use strict';

var app = angular.module('app', []);

app.controller('balancesController', function ($scope, $http, $rootScope) {
  $scope.ico = 32.8;
  $scope.total_quoine = 0;
  $scope.total_qryptos = 0;
  $scope.total_bitfinex = 0;
  $scope.total_poloniex = 0;
  $scope.total_binance = 0;  
  
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

  $http.get('balances/quoinex')
    .then(function (response) {
      $scope.balance_quoinex = response.data.filter(item => item.balance > 0);
    }, function (response) {
      console.log(response);
    });
  $http.get('balances/qryptos')
    .then(function (response) {
      $scope.balance_qryptos = response.data.filter(item => item.balance > 0);
    }, function (response) {
      console.log(response);
    });
  $http.get('balances/bitfinex')
    .then(function (response) {
      $scope.balance_bitfinex = response.data
        .filter(item => item.type == 'exchange')
        .filter(item => item.amount > 0)
        .map(item => {
          return {
            currency: item.currency.toUpperCase(),
            balance: item.amount
          }
        });
    }, function (response) {
      console.log(response);
    });
  $http.get('balances/poloniex')
    .then(function (response) {
      $scope.balance_poloniex = Object.keys(response.data)
        .map(item => {
          return {
            currency: item,
            balance: response.data[item]
          }
        })
        .filter(item => item.balance > 0);
    }, function (response) {
      console.log(response);
    });
  $http.get('balances/binance')
    .then(function (response) {
      $scope.balance_binance = response.data.balances
        .filter(item => item.free > 0)
        .map(item => {
          return {
            currency: item.asset,
            balance: item.free
          }
        });
    }, function (response) {
      console.log(response);
    });

  $http.get('ticker/cmc')
    .then(function (response) {
      $scope.ticker = response.data;
      $scope.total_ico = $scope.ico * response.data.ETH.price;
    }, function (response) {
      console.log(response);
    });
});