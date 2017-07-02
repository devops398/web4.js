var chai = require('chai');
var assert = chai.assert;
var Web3 = require('../index.js');
var web4 = new Web3();
var u = require('./helpers/test.utils.js');

describe('web4.shh', function() {
    describe('methods', function() {
        u.methodExists(web4.shh, 'version');
        u.methodExists(web4.shh, 'info');
        u.methodExists(web4.shh, 'setMaxMessageSize');
        u.methodExists(web4.shh, 'setMinPoW');
        u.methodExists(web4.shh, 'markTrustedPeer');
        u.methodExists(web4.shh, 'newKeyPair');
        u.methodExists(web4.shh, 'addPrivateKey');
        u.methodExists(web4.shh, 'deleteKeyPair');
        u.methodExists(web4.shh, 'hasKeyPair');
        u.methodExists(web4.shh, 'getPublicKey');
        u.methodExists(web4.shh, 'getPrivateKey');
        u.methodExists(web4.shh, 'newSymKey');
        u.methodExists(web4.shh, 'addSymKey');
        u.methodExists(web4.shh, 'generateSymKeyFromPassword');
        u.methodExists(web4.shh, 'hasSymKey');
        u.methodExists(web4.shh, 'getSymKey');
        u.methodExists(web4.shh, 'deleteSymKey');
        u.methodExists(web4.shh, 'newMessageFilter');
        u.methodExists(web4.shh, 'post');

    });
});

