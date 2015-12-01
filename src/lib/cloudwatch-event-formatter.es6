'use strict'

import {isEmpty} from 'lodash'

export default class CloudWatchEventFormatter {
  static formatLogItem(formatter) {
    return function(item) {
      
      return {
        message: CloudWatchEventFormatter._logItemToCloudWatchMessage(item, formatter),
        timestamp: item.date
      }
    }
  }

  static _logItemToCloudWatchMessage (item, formatter) {
    const meta = isEmpty(item.meta) ? ''
      : ' ' + JSON.stringify(item.meta, null, 2)
    const message = formatter === undefined ? `${item.message}` : formatter(item) 
    return `[${item.level.toUpperCase()}]` +  " " + message + `${meta}`
  }
}
