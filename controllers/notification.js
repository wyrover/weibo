/**
 * Created by Tink on 2015/9/20.
 */

var UserModel = require('../models').user;
var reqParser = require('../services/reqParser');

exports.push = function(req, res){
    var username = reqParser.parseProp(req, 'username');


}
