var request = require('request');
var crypto = require('crypto');

var config = require('../../config');

var clientKey = config.itbit.clientKey;
var secretKey = config.itbit.secretKey;
var userId = config.itbit.userId;
var walletId = config.itbit.walletId;

var base = 'https://api.itbit.com/v1/';
var nonce = 0;

function get_nonce() {
	nonce += 1;
	return nonce.toString();
}

function getOptions(verb, url, json) {
	var nonce = get_nonce();
	var timestamp = Date.now().toString();
	var body = '';

	if (verb == 'PUT' || verb == 'POST') {
		body = JSON.stringify(json);
	}

	var message = [verb, url, body, nonce, timestamp];
	message = new Buffer(JSON.stringify(message)).toString('utf8');
	message = nonce + message;
	var hash = crypto.createHash('sha256').update(message).digest('binary');
	hash = url + hash;
	var signature = crypto.createHmac('sha512', secretKey).update(hash).digest('base64').toString('utf8');

	var headers = {
		'Authorization': clientKey + ':' + signature,
		'X-Auth-Timestamp': timestamp,
		'X-Auth-Nonce': nonce,
		'Content-Type': 'application/json'
	};

	var options = {
		url: url,
		headers: headers,
		body: body
	};
	return options;
}

var get_all_wallets = function (callback) {
	var verb = 'GET';
	var url = base + 'wallets?userId=' + userId;
	var body = '';

	var options = getOptions(verb, url, body);

	request.get(options, function (error, response, body) {
		callback(JSON.parse(body));
	});
};

var get_trade = function (callback) {
	var verb = 'GET';
	var url = base + 'wallets/' + walletId + '/trades';
	var body = '';

	var options = getOptions(verb, url, body);

	request.get(options, function (error, response, body) {
		callback(JSON.parse(body));
	});
};

var get_order = function (callback) {
	var verb = 'GET';
	var url = base + 'wallets/' + walletId + '/orders';
	var body = '';

	var options = getOptions(verb, url, body);

	request.get(options, function (error, response, body) {
		callback(JSON.parse(body));
	});
};

var new_order = function (amount, price, side, callback) {
	var verb = 'POST';
	var url = base + 'wallets/' + walletId + '/orders';
	var body = {
		side: side,
		type: 'limit',
		currency: 'XBT',
		amount: amount,
		price: price,
		instrument: 'XBTUSD'
	};
	console.log("ibit.js new_order");
	console.log(body);
	var options = getOptions(verb, url, body);

	request.post(options, function (error, response, body) { //check with kangxi whether request.post is correct.
		callback(JSON.parse(body));
	});
};

var cancel_order = function (orderId, callback) {
	var verb = 'DELETE';
	var url = base + 'wallets/' + walletId + '/orders/' + orderId;
	var body = '';

	var options = getOptions(verb, url, body);

	request.del(options, function (error, response, body) {
		callback(JSON.parse(body));
	});
};


module.exports = {
	balances: get_all_wallets,
	liveorders: get_order,
	neworder: new_order,
	cancelorder: cancel_order,
	trades: get_trade
};