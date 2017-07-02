var chai = require('chai');
var assert = chai.assert; 
var Web3 = require('../index.js');
var web4 = new Web3();
var u = require('./helpers/test.utils.js');

describe('web4.db', function() {
    describe('methods', function() {
        u.methodExists(web4.db, 'putHex');
        u.methodExists(web4.db, 'getHex');
        u.methodExists(web4.db, 'putString');
        u.methodExists(web4.db, 'getString');
    });
});

