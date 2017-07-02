var chai = require('chai');
var assert = chai.assert;
var Web3 = require('../index');
var web4 = new Web3();
var FakeHttpProvider = require('./helpers/FakeHttpProvider');
var utils = require('../lib/utils/utils');

var tests = [{
    protocol: 'eth',
    args: ['latest'],
    firstResult: 1,
    firstPayload: {
        method: "eth_newBlockFilter",
        params: []
    },
    secondResult: ['0x1234'],
    secondPayload: {
        method: "eth_getFilterChanges"
    }
},
{
    protocol: 'eth',
    args: ['pending'],
    firstResult: 1,
    firstPayload: {
        method: "eth_newPendingTransactionFilter",
        params: []
    },
    secondResult: ['0x1234'],
    secondPayload: {
        method: "eth_getFilterChanges"
    }
}];

var testPolling = function (tests) {
    
    describe('web4.eth.filter.polling', function () {
        tests.forEach(function (test, index) {
            it('should create && successfully poll filter', function (done) {

                // given
                var provider = new FakeHttpProvider(); 
                web4.setProvider(provider);
                web4.reset();
                provider.injectResult(test.firstResult);
                var step = 0;
                provider.injectValidation(function (payload) {
                    if (step === 0) {
                        step = 1;
                        assert.equal(payload.jsonrpc, '2.0');
                        assert.equal(payload.method, test.firstPayload.method);
                        assert.deepEqual(payload.params, test.firstPayload.params);
                    } else if (step === 1 && utils.isArray(payload)) {
                        step++;
                        var r = payload.filter(function (p) {
                            return p.jsonrpc === '2.0' && p.method === test.secondPayload.method && p.params[0] === test.firstResult;
                        });
                        assert.equal(r.length > 0, true);
                    }

                });

                // when
                var filter = web4[test.protocol].filter.apply(web4[test.protocol], test.args);
                provider.injectBatchResults([test.secondResult]);
                filter.watch(function (err, result) {
                    if (test.err) {
                        // todo
                    } else {
                        assert.equal(result, test.secondResult[0]);
                    }
                    filter.stopWatching(function (err) {
                        assert.isNotOk(err);
                        done();
                    });

                });
            });
            it('should create && successfully poll filter when passed as callback', function (done) {

                // given
                var provider = new FakeHttpProvider(); 
                web4.setProvider(provider);
                web4.reset();
                provider.injectResult(test.firstResult);
                var step = 0;
                provider.injectValidation(function (payload) {
                    if (step === 0) {
                        step = 1;
                        assert.equal(payload.jsonrpc, '2.0');
                        assert.equal(payload.method, test.firstPayload.method);
                        assert.deepEqual(payload.params, test.firstPayload.params);
                    } else if (step === 1 && utils.isArray(payload)) {
                        step++;
                        var r = payload.filter(function (p) {
                            return p.jsonrpc === '2.0' && p.method === test.secondPayload.method && p.params[0] === test.firstResult;
                        });
                        assert.equal(r.length > 0, true);
                    }

                });

                // add callback
                test.args.push(function (err, result) {
                    if (test.err) {
                        // todo
                    } else {
                        assert.equal(result, test.secondResult[0]);
                    }
                    filter.stopWatching(function (err) {
                        assert.isNotOk(err);
                        done();
                    });

                });

                // when
                var filter = web4[test.protocol].filter.apply(web4[test.protocol], test.args);
                provider.injectBatchResults([test.secondResult]);
            });
        }); 
    });
};

testPolling(tests);
