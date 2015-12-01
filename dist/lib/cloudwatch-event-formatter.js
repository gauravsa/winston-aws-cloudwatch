'use strict';

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _lodash = require('lodash');

var CloudWatchEventFormatter = (function () {
  function CloudWatchEventFormatter() {
    _classCallCheck(this, CloudWatchEventFormatter);
  }

  _createClass(CloudWatchEventFormatter, null, [{
    key: 'formatLogItem',
    value: function formatLogItem(formatter) {
      return function (item) {

        return {
          message: CloudWatchEventFormatter._logItemToCloudWatchMessage(item, formatter),
          timestamp: item.date
        };
      };
    }
  }, {
    key: '_logItemToCloudWatchMessage',
    value: function _logItemToCloudWatchMessage(item, formatter) {
      var meta = (0, _lodash.isEmpty)(item.meta) ? '' : ' ' + JSON.stringify(item.meta, null, 2);
      var message = formatter === undefined ? '' + item.message : formatter(item);
      return '[' + item.level.toUpperCase() + ']' + " " + message + ('' + meta);
    }
  }]);

  return CloudWatchEventFormatter;
})();

exports['default'] = CloudWatchEventFormatter;
module.exports = exports['default'];