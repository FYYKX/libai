'use strict'

var app = angular.module('app', []);

app.controller('balancesController', function($scope, $http) {
	var data = function() {
		$scope.total_usd = 0;
		$scope.total_bitcoin = 0;

		$http.get('balances/bitfinex')
			.then(function(response) {
				var data = response.data;
				$scope.bitfinex_usd = parseFloat(data.usd);
				$scope.bitfinex_bitcoin = parseFloat(data.bitcoin);
				$scope.total_usd += $scope.bitfinex_usd;
				$scope.total_bitcoin += $scope.bitfinex_bitcoin;
			}, function(response) {
				console.log(response);
			});

		$http.get('balances/btce')
			.then(function(response) {
				var data = response.data;
				$scope.btc_usd = parseFloat(data.usd);
				$scope.btc_bitcoin = parseFloat(data.bitcoin);
				$scope.total_usd += $scope.btc_usd;
				$scope.total_bitcoin += $scope.btc_bitcoin;
			}, function(response) {
				console.log(response);
			});

		$http.get('balances/itbit')
			.then(function(response) {
				var data = response.data;
				$scope.itbit_usd = parseFloat(data.usd);
				$scope.itbit_bitcoin = parseFloat(data.bitcoin);
				$scope.total_usd += $scope.itbit_usd;
				$scope.total_bitcoin += $scope.itbit_bitcoin;
			}, function(response) {
				console.log(response);
			});
	};

	data();

	$scope.loadBalance = data;
});

app.controller('orderController', function($scope, $http) {
	$scope.loadOrder = function() {
		$http.get('liveorders/bitfinex')
			.then(function(response) {
				$scope.bitfinex_orders = response.data;
			});
		$http.get('liveorders/btce')
			.then(function(response) {
				$scope.btce_orders = response.data;
			});
		$http.get('liveorders/itbit')
			.then(function(response) {
				$scope.itbit_orders = response.data;
			});
	};

	$scope.cancelOrder = function(exchange, index) {
		//console.log($scope.itbit_orders);
		switch (exchange) {
			case 'bitfinex':
				var id = $scope.bitfinex_orders[index].id;
				$http.get('cancelorder/bitfinex/' + id)
					.then(function(response) {
						$scope.bitfinex_orders.splice(index, 1);
					});
				break;
			case 'btce':
				$http.get('cancelorder/btce/' + index)
					.then(function(response) {
						var items = {};
						angular.forEach($scope.btce_orders, function(value, key) {
							if (key != index) {
								items[key] = value;
							}
						});

						$scope.btce_orders = items;
					});
				break;
			case 'itbit':
				var id = $scope.itbit_orders[index].id;
				$http.get('cancelorder/itbit/' + id)
					.then(function(response) {
						$scope.itbit_orders.splice(index, 1);
					});
				break;
		}
	};
});


app.controller('tradeController', function($scope, $http) {
	$scope.loadTrades = function() {
		$http.get('trades/bitfinex')
			.then(function(response) {
				$scope.bitfinex_trades = response.data;
			});
		$http.get('trades/btce')
			.then(function(response) {
				$scope.btce_trades = response.data;
			});
		$http.get('trades/itbit')
			.then(function(response) {
				$scope.itbit_trades = response.data;
			});
	};
});

app.controller('bookController', function($scope, $http) {
	var books = [];
	var stop = false;
	var size = 10;

	$scope.count = 0;
	var start = function() {
		return $http.get('book')
			.then(function(response) {
				$scope.count++;
				if (response.data) {
					var last = angular.toJson(books[books.length - 1]);
					if (JSON.stringify(response.data) != last) {
						$('audio')[0].play();
						books.push(response.data);
						if (books.length > 10) {
							books.shift();
						};
						$scope.books = books;
					};
				};
				if (!stop) {
					return start();
				};
			}, function(response) {
				$scope.count++;
				console.log(response);
				if (!stop) {
					return start();
				};
			});
	};

	$scope.start = function() {
		stop = false;
		return start();
	}

	$scope.stop = function() {
		stop = true;
	};

	$scope.clear = function() {
		books = [];
		$scope.books = [];
		$scope.count = 0;
	}

	$scope.newOrder = function(index) {
		var book = $scope.books[index];
		if (confirm("Buy from " + book.asks_exchange + " at price: " + book.asks_price + " and amount: " + book.possibleVolume + "\n" + "Sell from " + book.bids_exchange + " at price: " + book.bids_price + " and amount: " + book.possibleVolume + "\n" + "Profit Percentage is : " + ((book.bids_price - book.asks_price) / book.bids_price))) {
			//if (confirm(JSON.stringify(book))) {

			var buy_exchange = book.asks_exchange;
			var sell_exchange = book.bids_exchange;
			var buy_price = book.asks_price;
			var sell_price = book.bids_price;
			var amount = book.possibleVolume;

			// for testing---
			// console.log("the real amount is :" +amount);

			// buy_exchange = 'bitfinex';
			// sell_exchange = 'btce';
			// buy_price = '100';
			// sell_price = '900';
			// amount = '0.01';

			// console.log("the test order that is being sent is:" +buy_exchange+ "  " +buy_price+ "  " +amount);
			// end testing---

			//new buy order
			$http.get('neworder/' + buy_exchange + '/buy/' + buy_price + '/' + amount)
				.then(function(response) {
					console.log(response);
				});

			//new sell order
			$http.get('neworder/' + sell_exchange + '/sell/' + sell_price + '/' + amount)
				.then(function(response) {
					console.log(response);
				});
		}
	};
});