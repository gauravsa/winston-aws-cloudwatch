'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _Promise = require('babel-runtime/core-js/promise')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _debug2 = require('debug');

var _debug3 = _interopRequireDefault(_debug2);

var _bottleneck = require('bottleneck');

var _bottleneck2 = _interopRequireDefault(_bottleneck);

var _defaults = require('defaults');

var _defaults2 = _interopRequireDefault(_defaults);

var _queue = require('./queue');

var _queue2 = _interopRequireDefault(_queue);

var _events = require('events');

var debug = (0, _debug3['default'])('winston-aws-cloudwatch:Relay');

var Relay = (function (_EventEmitter) {
  _inherits(Relay, _EventEmitter);

  function Relay(client, options) {
    _classCallCheck(this, Relay);

    _get(Object.getPrototypeOf(Relay.prototype), 'constructor', this).call(this);
    debug('constructor', { client: client, options: options });
    this._client = client;
    this._options = (0, _defaults2['default'])(options, {
      submissionInterval: 2000,
      batchSize: 20
    });
    this._limiter = null;
    this._queue = null;
  }

  _createClass(Relay, [{
    key: 'start',
    value: function start() {
      var _this = this;

      debug('start');
      if (this._queue) {
        throw new Error('Already started');
      }
      this._limiter = new _bottleneck2['default'](1, this._options.submissionInterval, 1);
      this._queue = new _queue2['default']();
      this._queue.on('push', function () {
        return _this._scheduleSubmission();
      });
      // Initial call to postpone first submission
      this._scheduleSubmission();
      return this._queue;
    }
  }, {
    key: '_scheduleSubmission',
    value: function _scheduleSubmission() {
      var _this2 = this;

      debug('scheduleSubmission');
      this._limiter.schedule(function () {
        return _this2._submit();
      });
    }
  }, {
    key: '_submit',
    value: function _submit() {
      var _this3 = this;

      if (this._queue.size === 0) {
        debug('submit: queue empty');
        return _Promise.resolve();
      }
      var batch = this._queue.head(this._options.batchSize);
      var num = batch.length;
      debug('submit: submitting ' + num + ' item(s)');
      return this._client.submit(batch).then(function () {
        return _this3._onSubmitted(num);
      }, function (err) {
        return _this3._onError(err);
      }).then(function () {
        return _this3._scheduleSubmission();
      });
    }
  }, {
    key: '_onSubmitted',
    value: function _onSubmitted(num) {
      debug('onSubmitted', { num: num });
      this._queue.remove(num);
    }
  }, {
    key: '_onError',
    value: function _onError(err) {
      debug('onError', { error: err });
      this.emit('error', err);
    }
  }]);

  return Relay;
})(_events.EventEmitter);

exports['default'] = Relay;
module.exports = exports['default'];