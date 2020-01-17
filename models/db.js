/**
 * /models/db
 *
 * @description :: Setup the db connection
 * @docs        :: TODO
 */
const mongoose = require('mongoose')
const debug = require('debug')('pixzelle-challenge:db')

const mongoURI = 'mongodb://localhost:27017/pixzelle'

mongoose.connect(mongoURI, {})

const connection = mongoose.connection
connection.on('error', console.error.bind(console, 'connection error: '))
connection.once('open', function () {
  debug(`DB url: ${mongoURI}`)
})

// module.exports = mongoose
