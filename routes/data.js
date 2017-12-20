//0: bitfinex
//1: poloniex
//3: quoinex
var map = [];

var find = function (index) {
    return map[index];
};

var save = function (index, value) {
    map[index] = value;
};

var findAll = function () {
    return map;
};

module.exports = {
    save: save,
    find: find,
    findAll: findAll
};