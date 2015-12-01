'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _winston = require('winston');

var _libCloudwatchClient = require('./lib/cloudwatch-client');

var _libCloudwatchClient2 = _interopRequireDefault(_libCloudwatchClient);

var _libLogItem = require('./lib/log-item');

var _libLogItem2 = _interopRequireDefault(_libLogItem);

var _libRelay = require('./lib/relay');

var _libRelay2 = _interopRequireDefault(_libRelay);

var CloudWatchTransport = (function (_Transport) {
  _inherits(CloudWatchTransport, _Transport);

  function CloudWatchTransport(_ref) {
    var logGroupName = _ref.logGroupName;
    var logStreamName = _ref.logStreamName;
    var awsConfig = _ref.awsConfig;
    var options = _ref.options;

    _classCallCheck(this, CloudWatchTransport);

    _get(Object.getPrototypeOf(CloudWatchTransport.prototype), 'constructor', this).call(this, options);
    var client = new _libCloudwatchClient2['default'](logGroupName, logStreamName, { awsConfig: awsConfig }, options.formatter);
    var relay = new _libRelay2['default'](client);
    relay.on('error', function (err) {
      return console.error('CloudWatch error: %s', err);
    });
    this._queue = relay.start();
  }

  _createClass(CloudWatchTransport, [{
    key: 'log',
    value: function log(level, msg, meta, callback) {
      this._queue.push(new _libLogItem2['default'](+new Date(), level, msg, meta));
      callback(null, true);
    }
  }]);

  return CloudWatchTransport;
})(_winston.Transport);

exports['default'] = CloudWatchTransport;
module.exports = exports['default'];