'use strict';

var app = angular.module('app', []);

app.controller('balancesController', function ($scope, $http, $rootScope) {
    var data = function () {
        $scope.total_usd = 0;
        $scope.total_ethereum = 0;

        $http.get('balances/qryptos')
            .then(function (response) {
                $scope.balances = response.data
                    .filter(item => item.balance > 0)
            }, function (response) {
                console.log(response);
            });
    };

    data();

    $scope.loadBalance = data;
});

app.controller('orderController', function ($scope, $http) {
    $scope.exchange = 'qryptos';
    $scope.product_id = '31';
    $scope.interval = 0.00000001;
    $scope.unit = 25;
    $scope.price = 0;
    $scope.amount = 0;

    var data = function () {
        $http.get('liveorders/qryptos')
            .then(function (response) {
                $scope.orders = response.data.models;
            });
    };

    $scope.newOrder = function (side) {
        var batch = {
            exchange: $scope.exchange,
            product_id: $scope.product_id,
            interval: $scope.interval,
            unit: $scope.unit,
            side: side,
            price: $scope.price,
            amount: $scope.amount
        };

        $http.post('/neworder/batch', batch)
            .then(function (response) {
                data();
            });
    };

    $scope.cancelOrder = function (index) {
        var id = $scope.orders[index].id;
        $http.get('cancelorder/qryptos/' + id)
            .then(function () {
                $scope.orders.splice(index, 1);
            });
    };

    data();
    $http.get('/products')
        .then(function (response) {
            $scope.symbols = response.data
                .filter(item => !item.disabled);
        });

    $scope.loadOrder = data;
});
