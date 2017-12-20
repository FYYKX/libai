'use strict';

var app = angular.module('app', []);

app.controller('balancesController', function($scope, $http, $rootScope) {
  var data = function() {
    $scope.total_usd = 0;
    $scope.total_ethereum = 0;

    $http.get('balances/bitfinex')
      .then(function(response) {
        $scope.balances = response.data;
      }, function(response) {
        console.log(response);
      });
  };

  data();

  $scope.loadBalance = data;
});

app.controller('orderController', function($scope, $http) {
  $scope.price = 0;
  $scope.amount = 0;
  $scope.pair = 'QSHETH';
  $scope.symbols = ['ETHUSD', 'QSHUSD', 'QSHETH', 'NEOUSD', 'NEOETH'];

  var data = function() {
    $http.get('liveorders/bitfinex')
      .then(function(response) {
        $scope.bitfinex_orders = response.data;
      });
  };

  $scope.newOrder = function(side) {
    $http.get('neworder/bitfinex/' + side + '/' + $scope.pair + '/' + $scope.price + '/' + $scope.amount)
      .then(function(response) {
        if (response.data.message) {
          $scope.message = response.data.message;
          $scope.show = true;
        } else {
          data();
        }
      });
  };

  $scope.cancelOrder = function(exchange, index) {
    switch (exchange) {
      case 'bitfinex':
        var bitfinex_id = $scope.bitfinex_orders[index].id;
        $http.get('cancelorder/bitfinex/' + bitfinex_id)
          .then(function() {
            $scope.bitfinex_orders.splice(index, 1);
          });
        break;
    }
  };

  data();

  $scope.loadOrder = data;
});
