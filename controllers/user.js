/**
 * Created by Tink on 2015/9/19.
 */

var jwt = require('jsonwebtoken');
var async = require('asyncawait').async;
var await = require('asyncawait').await;
var UserModel = require('../models').user;
var RoleModel = require('../models').role;
var reqParser = require('../services/reqParser');
var constant = require('../constant');
var config = require('../config');
var errHandler = require('../services/errHandler');

//                      sign
//------------------------------------------------
exports.signIn = async(function(req, res){
    var username = reqParser.parseProp(req, 'username');
    var password = reqParser.parseProp(req, 'password');

    try{
        var user = await(UserModel.findOne({name: username, password: password}).exec());
        errHandler.handleNotFound(user);
        var result = user.toObject();
        delete user.password;

        var userRole = await(RoleModel.findOne({type: result.role}).exec());
        errHandler.handleNotFound(userRole);
        result.permissions = userRole.permissions;
        result.token = jwt.sign(result, config.tokenSecret, {expiresInMinutes: config.tokenExpires});
    }catch(err){
        errHandler.handleDbErr();
    }
})


exports.signUp = function(req, res){

}
exports.signUp = function(req, res){
    var username = reqParser.parseProp(req, 'username');
    var password = reqParser.parseProp(req, 'password');
    var email = reqParser.parseProp(req, 'email');

    // Check whether the email already exists
    UserModel.findOne({email: email}, function(err, doc){
        if(err){
            return res.json({
                errLog: constant.errLog.DbErr
            });
        }

        if(doc){
            return res.json({
                errLog: constant.errLog.AlreadyExists
            });
        }

        // check whether the username already exists
        UserModel.findOne({name: username}, function(err, docx){
            if(err){
                return res.json({
                    errLog: constant.errLog.DbErr
                });
            }

            if(docx){
                return res.json({
                    errLog: constant.errLog.AlreadyExists
                });
            }

            var newUser = {};
            newUser.name = username;
            newUser.password = password;
            newUser.email = email;
            //todo maybe should add some pre-notifications/posts to user feeds
            UserModel.create(newUser, function(err, docxl){
               return res.json({
                   data: docxl
               })
            });

        });
    });

}


//                  user_base_info
//------------------------------------------------
exports.getBaseInfo = function (req, res) {
    var username = reqParser.parseProp(req, 'username');

    UserModel.findOne({name: username}, function(err, doc){
        if(err){
            return res.json({
                errLog: constant.errLog.DbErr
            });
        }

        if(!doc){
            return res.json({
                errLog: constant.errLog.DbNotFound
            });
        }

        var result = {};
        result = doc.toObject();
        delete result.password;

        RoleModel.findOne({type: result.role}, function(err, docx){
            if(err){
                return res.json({
                    errLog: constant.errLog.DbErr
                });
            }

            if(!docx){
                return res.json({
                    errLog: constant.errLog.DbNotFound
                });
            }

            result.permissions = docx.permissions;
            return res.json({
                data: result
            });
        });

    });
}

exports.updateBaseInfo = function (req, res){
    var username = reqParser.parseProp(req, 'username');
    var newUser = reqParser.parseProp(req, 'newUser');

    UserModel.findOne({name: username}, function(err, doc){
        if(err){
            return res.json({
                errLog: constant.errLog.DbErr
            });
        }

        if(!doc){
            return res.json({
                errLog: constant.errLog.DbNotFound
            });
        }

        doc = newUser;
        doc.save(function(err){
            if(err){
                return res.json({
                    errLog: constant.errLog.DbErr
                });
            }

            var result = {};
            result = doc.toObject();
            delete result.password;

            return res.json({
                data: result
            });
        });
    });
}

// todo 这个函数需要查查!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
exports.deleteOne = function(req, res){
    var username = reqParser.parseProp(req, 'username');

    UserModel.findOneAndRemove({name: username}, function(err, doc){
        if(err){
            return res.json({
                errLog: constant.errLog.DbErr
            });
        }

        if(!doc){
            return res.json({
                errLog: constant.errLog.DbNotFound
            });
        }

    });
}
































