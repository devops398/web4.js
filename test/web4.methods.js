var Web3 = require('../index.js');
var web4 = new Web3();
var u = require('./helpers/test.utils.js');

describe('web4', function() {
    describe('methods', function () {
        u.methodExists(web4, 'sha3');
        u.methodExists(web4, 'toAscii');
        u.methodExists(web4, 'fromAscii');
        u.methodExists(web4, 'toDecimal');
        u.methodExists(web4, 'fromDecimal');
        u.methodExists(web4, 'fromWei');
        u.methodExists(web4, 'toWei');
        u.methodExists(web4, 'toBigNumber');
        u.methodExists(web4, 'isAddress');
        u.methodExists(web4, 'setProvider');
        u.methodExists(web4, 'reset');

        u.propertyExists(web4, 'providers');
        u.propertyExists(web4, 'eth');
        u.propertyExists(web4, 'db');
        u.propertyExists(web4, 'shh');
    });
});

