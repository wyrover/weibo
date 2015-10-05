/**
 * Created by Tink on 2015/9/19.
 */

var jwt = require('jsonwebtoken');
var async = require('asyncawait').async;
var await = require('asyncawait').await;
var UserModel = require('../models').user;
var RoleModel = require('../models').role;
var reqParser = require('../services/reqParser');
var errHandler = require('../services/errHandler');
var userService = require('../services/user');
var constant = require('../constant');
var config = require('../config');

//                      sign
//------------------------------------------------
exports.signIn = async(function(req, res){
    var username = reqParser.parseProp(req, 'username');
    var email = reqParser.parseProp(req, 'email');
    var password = reqParser.parseProp(req, 'password');

    try{
        var user = await(userService.getUserByNameOrEmailWithPassword(username, email, password));
        errHandler.handleNotFound(user, res);
        var result = user.toObject();

        var userRole = await(RoleModel.findOne({type: result.role}).exec());
        //errHandler.handleNotFound(userRole, res);
        result.permissions = userRole.permissions;
        result.token = jwt.sign(result, config.tokenSecret, {expiresInMinutes: config.tokenExpires});
        delete result.password;

        return res.json({
            data: result
        })
    }catch(err){
        errHandler.handleDbErr(res);
    }
})


exports.signUp = async(function(req, res){
    var username = reqParser.parseProp(req, 'username');
    var password = reqParser.parseProp(req, 'password');
    var email = reqParser.parseProp(req, 'email');

    try{
        var emailExisted = await(UserModel.findOne({email: email}).exec());
        errHandler.handleAlreadyExists(emailExisted, res);
        var nameExisted = await(UserModel.findOne({name: username}).exec());
        errHandler.handleAlreadyExists(nameExisted, res);

        var newUser = {};
        newUser.email = email;
        newUser.name = username;
        newUser.password = password;
        //todo add some pre-notification/post to user feeds
        var doc = await(UserModel.create(newUser));
        var result = {};
        result = doc.toObject();
        delete result.password;
        return res.json({
            data: result
        })
    }catch(err){
        errHandler.handleDbErr(res);
    }
})

//                 user base info
//------------------------------------------------
exports.getBaseInfo = async(function(req, res){
    var username = reqParser.parseProp(req, 'username');
    var userId = reqParser.parseProp(req, 'userId');

    try{
        // find user by id or name
        var user = await(userService.getUserByIdOrName(userId, username));
        errHandler.handleNotFound(user, res);

        var result = {};
        result = user.toObject();

        var userRole = await(RoleModel.findOne({type: result.role}).exec());
        errHandler.handleNotFound(userRole, res);
        result.permissions = userRole.permissions;
        delete user.password;
        return res.json({
            data: result
        })
    }catch(err){
        errHandler.handleDbErr(res);
    }

})


var updateUserProp = async(function(req, res, propStr){
    var userId = reqParser.parseProp(req, 'userId');
    var username = reqParser.parseProp(req, 'username');
    var prop = reqParser.parseProp(req, propStr);

    try{
        var user = await(userService.getUserByIdOrName(userId, username));
        errHandler.handleNotFound(user, res);

        user[propStr] = prop;
        var result = {};
        result = user.toObject();

        await(user.save());

        delete result.password;
        return res.json({
            data: result
        })
    }catch(err){
        errHandler.handleDbErr(res);
    }
})


// just update name/pw/email
exports.updateBaseInfo = async(function (req, res){
    var userId = reqParser.parseProp(req, 'userId');
    var username = reqParser.parseProp(req, 'username');
    var password = reqParser.parseProp(req, 'password');
    var email = reqParser.parseProp(req, 'email');

    try{
        var emailOwner = await(UserModel.findOne({email: email}).exec());
        errHandler.handleAlreadyExists(emailOwner, res);

        var user = await(UserModel.findById(userId).exec());
        errHandler.handleNotFound(user, res);

        user.username = username;
        user.password = password;
        user.email = email;

        var result = {};
        result = user.toObject();

        await(user.save());

        delete result.password;//notice: this result doesn't contain the permissions!
        return res.json({
            data: result
        });

    }catch(err){
        errHandler.handleDbErr(res)
    }
})


exports.updateSignature = function (req, res) {
    updateUserProp(req, res, 'signature');
}

exports.changeRole = async(function(req, res){
    var userId = reqParser.parseProp(req, 'userId');
    var username = reqParser.parseProp(req, 'username');
    var role = reqParser.parseProp(req, 'role');

    try{
        var user = await(userService.getUserByIdOrName(userId, username));
        errHandler.handleNotFound(user, res);

        var newRole = await(RoleModel.findOne({type: role}).exec());
        errHandler.handleNotFound(newRole, res);

        user.role = role;
        var result = {};
        result = user.toObject();
        result.permissions = newRole.permissions;

        await(user.save());

        delete result.password;
        return res.json({
            data: result
        })
    }catch(err){
        errHandler.handleDbErr(res);
    }
})


//todo update avatar


//------------todo this function has some problem maybe---------------
exports.deleteOne = async(function(req, res){
    var userId = reqParser.parseProp(req, 'userId');
    var username = reqParser.parseProp(req, 'username');

    if(userId){
        UserModel.findByIdAndRemove({name: username}, function(err, doc){
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
            return res.json({
                data: true
            })
        });
    }
    if(username){
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
            return res.json({
                data: true
            })
        });
    }
    return res.json({
        errLog: constant.errLog.ReqArgumentIsUnvalid
    })

})































