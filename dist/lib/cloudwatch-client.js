'use strict';

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _debug2 = require('debug');

var _debug3 = _interopRequireDefault(_debug2);

var _awsSdk = require('aws-sdk');

var _awsSdk2 = _interopRequireDefault(_awsSdk);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _defaults = require('defaults');

var _defaults2 = _interopRequireDefault(_defaults);

var _lodash = require('lodash');

var _cloudwatchEventFormatter = require('./cloudwatch-event-formatter');

var _cloudwatchEventFormatter2 = _interopRequireDefault(_cloudwatchEventFormatter);

var debug = (0, _debug3['default'])('winston-aws-cloudwatch:CloudWatchClient');

var CloudWatchClient = (function () {
  function CloudWatchClient(logGroupName, logStreamName, options, formatter) {
    _classCallCheck(this, CloudWatchClient);

    debug('constructor', { logGroupName: logGroupName, logStreamName: logStreamName, options: options });
    this._logGroupName = logGroupName;
    this._logStreamName = logStreamName;
    this._formatter = formatter;
    this._options = (0, _defaults2['default'])(options, {
      awsConfig: null,
      maxSequenceTokenAge: -1
    });
    this._sequenceTokenInfo = null;
    var client = new _awsSdk2['default'].CloudWatchLogs(this._options.awsConfig);
    this._client = _bluebird2['default'].promisifyAll(client);
  }

  _createClass(CloudWatchClient, [{
    key: 'submit',
    value: function submit(batch) {
      var _this = this;

      debug('submit', { batch: batch });
      return this._getSequenceToken().then(function (sequenceToken) {
        return _this._putLogEvents(batch, sequenceToken);
      }).then(function (_ref) {
        var nextSequenceToken = _ref.nextSequenceToken;
        return _this._storeSequenceToken(nextSequenceToken);
      });
    }
  }, {
    key: '_putLogEvents',
    value: function _putLogEvents(batch, sequenceToken) {
      debug('putLogEvents', { batch: batch, sequenceToken: sequenceToken });
      var params = {
        logGroupName: this._logGroupName,
        logStreamName: this._logStreamName,
        logEvents: batch.map(_cloudwatchEventFormatter2['default'].formatLogItem(this._formatter)),
        sequenceToken: sequenceToken
      };
      return this._client.putLogEventsAsync(params);
    }
  }, {
    key: '_getSequenceToken',
    value: function _getSequenceToken() {
      var now = +new Date();
      var isStale = !this._sequenceTokenInfo || this._sequenceTokenInfo.date + this._options.maxSequenceTokenAge < now;
      return isStale ? this._fetchAndStoreSequenceToken() : _bluebird2['default'].resolve(this._sequenceTokenInfo.sequenceToken);
    }
  }, {
    key: '_fetchAndStoreSequenceToken',
    value: function _fetchAndStoreSequenceToken() {
      var _this2 = this;

      debug('fetchSequenceToken');
      return this._findLogStream().then(function (_ref2) {
        var uploadSequenceToken = _ref2.uploadSequenceToken;
        return _this2._storeSequenceToken(uploadSequenceToken);
      });
    }
  }, {
    key: '_storeSequenceToken',
    value: function _storeSequenceToken(sequenceToken) {
      debug('storeSequenceToken', { sequenceToken: sequenceToken });
      var date = +new Date();
      this._sequenceTokenInfo = { sequenceToken: sequenceToken, date: date };
      return sequenceToken;
    }
  }, {
    key: '_findLogStream',
    value: function _findLogStream(nextToken) {
      var _this3 = this;

      debug('findLogStream', { nextToken: nextToken });
      var params = {
        logGroupName: this._logGroupName,
        logStreamNamePrefix: this._logStreamName,
        nextToken: nextToken
      };
      return this._client.describeLogStreamsAsync(params).then(function (_ref3) {
        var logStreams = _ref3.logStreams;
        var nextToken = _ref3.nextToken;

        var match = (0, _lodash.find)(logStreams, function (_ref4) {
          var logStreamName = _ref4.logStreamName;
          return logStreamName === _this3._logStreamName;
        });
        if (match) {
          return match;
        }
        if (nextToken == null) {
          throw new Error('Log stream not found');
        }
        return _this3._findLogStream(nextToken);
      });
    }
  }]);

  return CloudWatchClient;
})();

exports['default'] = CloudWatchClient;
module.exports = exports['default'];