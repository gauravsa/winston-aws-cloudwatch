'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _debug2 = require('debug');

var _debug3 = _interopRequireDefault(_debug2);

var _events = require('events');

var debug = (0, _debug3['default'])('winston-aws-cloudwatch:Queue');

var Queue = (function (_EventEmitter) {
  _inherits(Queue, _EventEmitter);

  function Queue() {
    _classCallCheck(this, Queue);

    _get(Object.getPrototypeOf(Queue.prototype), 'constructor', this).call(this);
    this._contents = [];
  }

  _createClass(Queue, [{
    key: 'push',
    value: function push(item) {
      debug('push', { item: item });
      this._contents.push(item);
      this.emit('push', item);
    }
  }, {
    key: 'head',
    value: function head(num) {
      debug('head', { num: num });
      return this._contents.slice(0, num);
    }
  }, {
    key: 'remove',
    value: function remove(num) {
      debug('remove', { num: num });
      this._contents.splice(0, num);
    }
  }, {
    key: 'size',
    get: function get() {
      return this._contents.length;
    }
  }]);

  return Queue;
})(_events.EventEmitter);

exports['default'] = Queue;
module.exports = exports['default'];