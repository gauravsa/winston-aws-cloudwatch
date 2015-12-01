'use strict';

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var LogItem = (function () {
  function LogItem(date, level, message, meta) {
    _classCallCheck(this, LogItem);

    this._date = date;
    this._level = level;
    this._message = message;
    this._meta = meta;
  }

  _createClass(LogItem, [{
    key: 'date',
    get: function get() {
      return this._date;
    }
  }, {
    key: 'level',
    get: function get() {
      return this._level;
    }
  }, {
    key: 'message',
    get: function get() {
      return this._message;
    }
  }, {
    key: 'meta',
    get: function get() {
      return this._meta;
    }
  }]);

  return LogItem;
})();

exports['default'] = LogItem;
module.exports = exports['default'];