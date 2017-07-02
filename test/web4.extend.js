var chai = require('chai');
var assert = chai.assert;
var FakeHttpProvider = require('./helpers/FakeHttpProvider');
var Web3 = require('../lib/web4');
var web4 = new Web3();


var tests = [{
    properties: [new web4._extend.Property({
        name: 'gasPrice',
        getter: 'eth_gasPrice',
        outputFormatter: web4._extend.formatters.outputBigNumberFormatter
    })]
},{
    methods: [new web4._extend.Method({
        name: 'getBalance',
        call: 'eth_getBalance',
        params: 2,
        inputFormatter: [web4._extend.utils.toAddress, web4._extend.formatters.inputDefaultBlockNumberFormatter],
        outputFormatter: web4._extend.formatters.outputBigNumberFormatter
    })]
},{
    property: 'admin',
    properties: [new web4._extend.Property({
        name: 'gasPrice',
        getter: 'eth_gasPrice',
        outputFormatter: web4._extend.formatters.outputBigNumberFormatter
    })],
    methods: [new web4._extend.Method({
        name: 'getBalance',
        call: 'eth_getBalance',
        params: 2,
        inputFormatter: [web4._extend.utils.toAddress, web4._extend.formatters.inputDefaultBlockNumberFormatter],
        outputFormatter: web4._extend.formatters.outputBigNumberFormatter
    })]
}];

describe('web4', function () {
    describe('_extend', function () {
        tests.forEach(function (test, index) {
            it('test no: ' + index, function () {
                web4._extend(test);


                if(test.properties)
                    test.properties.forEach(function(property){

                        var provider = new FakeHttpProvider();
                        web4.setProvider(provider);
                        provider.injectResult('');
                        provider.injectValidation(function (payload) {
                            assert.equal(payload.jsonrpc, '2.0');
                            assert.equal(payload.method, property.getter);
                        });

                        if(test.property) {
                            assert.isObject(web4[test.property][property.name]);
                            assert.isFunction(web4[test.property]['get'+ property.name.charAt(0).toUpperCase() + property.name.slice(1)]);
                        } else {
                            assert.isObject(web4[property.name]);
                            assert.isFunction(web4['get'+ property.name.charAt(0).toUpperCase() + property.name.slice(1)]);                        
                        }
                    });

                if(test.methods)
                    test.methods.forEach(function(property){
                        if(test.property)
                            assert.isFunction(web4[test.property][property.name]);
                        else
                            assert.isFunction(web4[property.name]);
                    });

            });
        });
    });
});

