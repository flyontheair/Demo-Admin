var merge = require('webpack-merge')
var prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  apiUrlPrefix: {
    dynamic: '"http://rapapi.org/mockjsdata/18714"',
    static: '""'
  }
})
