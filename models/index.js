/**
 * Created by Tink on 2015/9/19.
 */

var mongoose = require('mongoose');
var config = require('../config');

// mongo db connection
mongoose.connect(config.dbConnectionString);
var db = mongoose.connection;

// err console.log
db.on('err', function(err){
    console.error('mongoose: connect to %s error: ', config.dbConnectionString, err.message);
    process.exit(1);
})

// open console.log
db.once('open', function () {
    console.log('mongoose: %s has been connected ', config.dbConnectionString);
})

module.exports = {
    user            : mongoose.model('user', require('./user').user),
    role            : mongoose.model('role', require('./user').role),
    permission      : mongoose.model('permission', require('./user').permission),
    post            : mongoose.model('post', require('./post').post),
    comment         : mongoose.model('comment', require('./post').comment),
    notification    : mongoose.model('notification', require('./post').notification),
}