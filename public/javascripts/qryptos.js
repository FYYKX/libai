'use strict';

var app = angular.module('app', []);

app.controller('orderController', function ($scope, $http, $interval) {
    if ("Notification" in window) {
        Notification.requestPermission().then(function (result) {
            console.log(result);
        });
    }

    $interval(function () {
        $http.get('liveorders/qryptos/filled')
            .then(function (response) {
                var models = response.data.models;
                $scope.orders = models;
                var order = models[0];
                var updated = order.updated_at * 1000;
                var now = Date.now();
                var between = (now - updated) / 1000;
                console.log(between);
                if (between < 20) {
                    var message = order.side + " " + order.currency_pair_code + " " + order.price + " " + order.filled_quantity + " " + order.status;
                    console.log(message);
                    new Notification(order.currency_pair_code, {
                        body: message,
                        requireInteraction: true
                    });
                }
            });
    }, 10 * 1000);
});