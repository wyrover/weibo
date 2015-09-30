/**
 * Created by Tink on 2015/9/20.
 */

var reqParser = require('../services/reqParser');
var constant = require('../constant');

function isNull(prop){
    if(typeof prop == 'undefined' || prop.trim() == ''){
        return true;
    }
    return false;
}

module.exports = {
    usernameIsNull: function(req, res, next){
        if(isNull(reqParser.parseProp(req, 'username'))){
            return res.json({
                errLog: constant.errLog.ReqArgumentIsUnvalid
            })
        }
        next();
    },

    passwordIsNull: function(req, res, next){
        if(isNull(reqParser.parseProp(req, 'password'))){
            return res.json({
                errLog: constant.errLog.ReqArgumentIsUnvalid
            })
        }
        next();
    },

    emailIsNull: function(req, res, next){
        if(isNull(reqParser.parseProp(req, 'email'))){
            return res.json({
                errLog: constant.errLog.ReqArgumentIsUnvalid
            })
        }
        next();
    },

    //todo
    isValidToken: function(req){
        var token = req.headers['authorization'];
        if(typeof token == 'undefined'){

        }
    }
}

