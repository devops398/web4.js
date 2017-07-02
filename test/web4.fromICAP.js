var chai = require('chai');
var Web3 = require('../index');
var web4 = new Web3();
var assert = chai.assert;

var tests = [
    { direct: 'XE7338O073KYGTWWZN0F2WZ0R8PX5ZPPZS', address: '00c5496aee77c1ba1f0854206a26dda82a81d6d8'}
];

describe('web4', function () {
    describe('fromICAP', function () {
        tests.forEach(function (test) {
            it('shoud transform iban to address: ' +  test.address, function () {
                assert.deepEqual(web4.fromICAP(test.direct), test.address);
            });
        });   
    });
});

