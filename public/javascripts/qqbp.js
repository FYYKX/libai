'use strict';

var app = angular.module('app', []);

app.controller('balancesController', function ($scope, $http, $rootScope) {
  var data = function () {
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

  data();

  $scope.loadBalance = data;
});