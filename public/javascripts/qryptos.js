'use strict';

var app = angular.module('app', []);

app.controller('orderController', function ($scope, $http, $interval) {
    if ("Notification" in window) {
        Notification.requestPermission().then(function (result) {
            console.log(result);
        });
    }

    $interval(function () {
        $http.get('liveorders/qryptos')
            .then(function (response) {
                var models = response.data.models;
                $scope.orders = models;
                var order = models[0];
                var updated = order.updated_at * 1000;
                var now = Date.now();
                var between = (now - updated) / 1000;
                console.log(between);
                if (between < 30) {
                    var message = order.side + " " + order.currency_pair_code + " " + order.filled_quantity + " " + order.status;
                    console.log(message);
                    new Notification(message);
                }
            });
    }, 10 * 1000);

    $scope.cancelOrder = function (exchange, index) {
        switch (exchange) {
            case 'qryptos':
                var qryptos_id = $scope.orders[index].id;
                $http.get('cancelorder/qryptos/' + qryptos_id)
                    .then(function () {
                        $scope.orders.splice(index, 1);
                    });
                break;
        }
    };
});