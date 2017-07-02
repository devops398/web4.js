var chai = require('chai');
var assert = chai.assert;
var Web3 = require('../index.js');
var web4 = new Web3();
var u = require('./helpers/test.utils.js');

describe('web4.net', function() {
    describe('methods', function() {
        u.propertyExists(web4.personal, 'listAccounts');
        u.methodExists(web4.personal, 'newAccount');
        u.methodExists(web4.personal, 'unlockAccount');
    });
});
