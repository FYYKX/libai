'use strict';

var app = angular.module('app', []);

app.controller('balancesController', function ($scope, $http, $rootScope) {
  var data = function () {
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
          .filter(item => item.amount > 0);
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

    $http.get('ticker')
      .then(function (response) {
        $scope.ticker = response.data;
      }, function (response) {
        console.log(response);
      });
  };

  data();

  $scope.loadBalance = function () {
    $scope.total_usd = 0;
    $scope.total_sgd = 0;

    $scope.total_eth = 0;
    $scope.total_qash = 0;
    $scope.total_btc = 0;

    $http.get('balances/qqbp')
      .then(function (response) {
        response.data.forEach(item => {
          $scope.total_usd += parseFloat(item.usd);
          $scope.total_sgd += parseFloat(item.sgd);

          $scope.total_eth += parseFloat(item.eth);
          $scope.total_qash += parseFloat(item.qash);
          $scope.total_btc += parseFloat(item.btc);
        });
        $scope.balances = response.data;
      }, function (response) {
        console.log(response);
      });
  };
});