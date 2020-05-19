'use strict'

if (process.env.NODE_ENV === 'production') {
    module.exports = require('./vbus-access-api.cjs.production.js')
} else {
    module.exports = require('./vbus-access-api.cjs.development.js')
}
