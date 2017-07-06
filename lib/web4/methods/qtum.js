"use strict";

var formatters = require('../formatters');
var utils = require('../../utils/utils');
var Method = require('../method');
var Property = require('../property');
var c = require('../../utils/config');
var Contract = require('../contract');
var watches = require('./watches');
var Filter = require('../filter');
var IsSyncing = require('../syncing');
var namereg = require('../namereg');
var Iban = require('../iban');
var transfer = require('../transfer');

var blockCall = function (args) {
  return (utils.isString(args[0]) && args[0].indexOf('0x') === 0) ? "qtum_getBlockByHash" : "qtum_getBlockByNumber";
};

var transactionFromBlockCall = function (args) {
  return (utils.isString(args[0]) && args[0].indexOf('0x') === 0) ? 'qtum_getTransactionByBlockHashAndIndex' : 'qtum_getTransactionByBlockNumberAndIndex';
};

var uncleCall = function (args) {
  return (utils.isString(args[0]) && args[0].indexOf('0x') === 0) ? 'qtum_getUncleByBlockHashAndIndex' : 'qtum_getUncleByBlockNumberAndIndex';
};

var getBlockTransactionCountCall = function (args) {
  return (utils.isString(args[0]) && args[0].indexOf('0x') === 0) ? 'qtum_getBlockTransactionCountByHash' : 'qtum_getBlockTransactionCountByNumber';
};

var uncleCountCall = function (args) {
  return (utils.isString(args[0]) && args[0].indexOf('0x') === 0) ? 'qtum_getUncleCountByBlockHash' : 'qtum_getUncleCountByBlockNumber';
};

function Qtum(web4) {
  this._requestManager = web4._requestManager;

  var self = this;

  methods().forEach(function(method) {
    method.attachToObject(self);
    method.setRequestManager(self._requestManager);
  });

  properties().forEach(function(p) {
    p.attachToObject(self);
    p.setRequestManager(self._requestManager);
  });


  this.iban = Iban;
  this.sendIBANTransaction = transfer.bind(null, this);
}

Object.defineProperty(Qtum.prototype, 'defaultBlock', {
  get: function () {
    return c.defaultBlock;
  },
  set: function (val) {
    c.defaultBlock = val;
    return val;
  }
});

Object.defineProperty(Qtum.prototype, 'defaultAccount', {
  get: function () {
    return c.defaultAccount;
  },
  set: function (val) {
    c.defaultAccount = val;
    return val;
  }
});

var methods = function () {
  var getBalance = new Method({
    name: 'getBalance',
    call: 'accountinfo',
    params: 0,
  });

  var getAccountAddress = new Method({
    name: 'getAccountAddress',
    call: 'getaccountaddress',
    params: 1
  });

  var getStorageAt = new Method({
    name: 'getStorageAt',
    call: 'qtum_getStorageAt',
    params: 3,
    inputFormatter: [null, utils.toHex, formatters.inputDefaultBlockNumberFormatter]
  });

  var getCode = new Method({
    name: 'getCode',
    call: 'qtum_getCode',
    params: 2,
    inputFormatter: [formatters.inputAddressFormatter, formatters.inputDefaultBlockNumberFormatter]
  });

  var getBlock = new Method({
    name: 'getBlock',
    call: blockCall,
    params: 2,
    inputFormatter: [formatters.inputBlockNumberFormatter, function (val) { return !!val; }],
    outputFormatter: formatters.outputBlockFormatter
  });

  var getUncle = new Method({
    name: 'getUncle',
    call: uncleCall,
    params: 2,
    inputFormatter: [formatters.inputBlockNumberFormatter, utils.toHex],
    outputFormatter: formatters.outputBlockFormatter,

  });

  var getCompilers = new Method({
    name: 'getCompilers',
    call: 'qtum_getCompilers',
    params: 0
  });

  var getBlockTransactionCount = new Method({
    name: 'getBlockTransactionCount',
    call: getBlockTransactionCountCall,
    params: 1,
    inputFormatter: [formatters.inputBlockNumberFormatter],
    outputFormatter: utils.toDecimal
  });

  var getBlockUncleCount = new Method({
    name: 'getBlockUncleCount',
    call: uncleCountCall,
    params: 1,
    inputFormatter: [formatters.inputBlockNumberFormatter],
    outputFormatter: utils.toDecimal
  });

  var getTransaction = new Method({
    name: 'getTransaction',
    call: 'qtum_getTransactionByHash',
    params: 1,
    outputFormatter: formatters.outputTransactionFormatter
  });

  var getTransactionFromBlock = new Method({
    name: 'getTransactionFromBlock',
    call: transactionFromBlockCall,
    params: 2,
    inputFormatter: [formatters.inputBlockNumberFormatter, utils.toHex],
    outputFormatter: formatters.outputTransactionFormatter
  });

  var getTransactionReceipt = new Method({
    name: 'getTransactionReceipt',
    call: 'qtum_getTransactionReceipt',
    params: 1,
    outputFormatter: formatters.outputTransactionReceiptFormatter
  });

  var getTransactionCount = new Method({
    name: 'getTransactionCount',
    call: 'qtum_getTransactionCount',
    params: 2,
    inputFormatter: [null, formatters.inputDefaultBlockNumberFormatter],
    outputFormatter: utils.toDecimal
  });

  var sendRawTransaction = new Method({
    name: 'sendRawTransaction',
    call: 'qtum_sendRawTransaction',
    params: 1,
    inputFormatter: [null]
  });

  var sendTransaction = new Method({
    name: 'sendTransaction',
    call: 'qtum_sendTransaction',
    params: 1,
    inputFormatter: [formatters.inputTransactionFormatter]
  });

  var sendToContract = new Method({
    name: 'sendToContract',
    call: 'sendtocontract',
    params: 6
  });

  var sign = new Method({
    name: 'sign',
    call: 'qtum_sign',
    params: 2,
    inputFormatter: [formatters.inputAddressFormatter, null]
  });

  var callContract = new Method({
    name: 'callContract',
    call: 'callcontract',
    params: 2
  });

  var estimateGas = new Method({
    name: 'estimateGas',
    call: 'qtum_estimateGas',
    params: 1,
    inputFormatter: [formatters.inputCallFormatter],
    outputFormatter: utils.toDecimal
  });

  var compileSolidity = new Method({
    name: 'compile.solidity',
    call: 'qtum_compileSolidity',
    params: 1
  });

  var compileLLL = new Method({
    name: 'compile.lll',
    call: 'qtum_compileLLL',
    params: 1
  });

  var compileSerpent = new Method({
    name: 'compile.serpent',
    call: 'qtum_compileSerpent',
    params: 1
  });

  var submitWork = new Method({
    name: 'submitWork',
    call: 'qtum_submitWork',
    params: 3
  });

  var getWork = new Method({
    name: 'getWork',
    call: 'qtum_getWork',
    params: 0
  });

  return [
    getAccountAddress,
    getBalance,
    getStorageAt,
    getCode,
    getBlock,
    getUncle,
    getCompilers,
    getBlockTransactionCount,
    getBlockUncleCount,
    getTransaction,
    getTransactionFromBlock,
    getTransactionReceipt,
    getTransactionCount,
    callContract,
    estimateGas,
    sendRawTransaction,
    sendToContract,
    sign,
    compileSolidity,
    compileLLL,
    compileSerpent,
    submitWork,
    getWork
  ];
};


var properties = function () {
  return [
    new Property({
      name: 'coinbase',
      getter: 'qtum_coinbase'
    }),
    new Property({
      name: 'mining',
      getter: 'qtum_mining'
    }),
    new Property({
      name: 'hashrate',
      getter: 'qtum_hashrate',
      outputFormatter: utils.toDecimal
    }),
    new Property({
      name: 'syncing',
      getter: 'qtum_syncing',
      outputFormatter: formatters.outputSyncingFormatter
    }),
    new Property({
      name: 'gasPrice',
      getter: 'qtum_gasPrice',
      outputFormatter: formatters.outputBigNumberFormatter
    }),
    new Property({
      name: 'accounts',
      getter: 'qtum_accounts'
    }),
    new Property({
      name: 'blockNumber',
      getter: 'qtum_blockNumber',
      outputFormatter: utils.toDecimal
    }),
    new Property({
      name: 'protocolVersion',
      getter: 'qtum_protocolVersion'
    })
  ];
};

Qtum.prototype.contract = function (abi) {
  var factory = new Contract(this, abi);
  return factory;
};

Qtum.prototype.filter = function (options, callback, filterCreationErrorCallback) {
  return new Filter(options, 'qtum', this._requestManager, watches.qtum(), formatters.outputLogFormatter, callback, filterCreationErrorCallback);
};

Qtum.prototype.namereg = function () {
  return this.contract(namereg.global.abi).at(namereg.global.address);
};

Qtum.prototype.icapNamereg = function () {
  return this.contract(namereg.icap.abi).at(namereg.icap.address);
};

Qtum.prototype.isSyncing = function (callback) {
  return new IsSyncing(this._requestManager, callback);
};

module.exports = Qtum;
