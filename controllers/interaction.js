/**
 * Created by Tink on 2015/9/20.
 */

var async = require('asyncawait').async;
var await = require('asyncawait').await;
var reqParser = require('../services/reqParser');
var errHandler = require('../services/errHandler');
var userService = require('../services/user');
var constant = require('../constant');
var UserModel = require('../models').user;

var alreadyInFollowingList = function(user, followingName){
    return user.followings.some(function(f){
        return f == followingName;
    })
}

var alreadyInFanList = function(user, followerName){
    return user.followers.some(function(f){
        return f == followerName
    })
}

var handleAlreadyHasThisFollowing = function(user, followingName, res){
    if(alreadyInFollowingList(user, followingName)){
        return res.json({
            errLog: constant.errLog.AlreadyExists
        })
    }
}

var handleAlreadyHasThisFan = function(user, followerName, res){
    if(alreadyInFanList(user, followerName)){
        return res.json({
            errLog: constant.errLog.AlreadyExists
        })
    }
}

var getIndexOrHandleNotFound = function(arr, rhs, index, res){
    var hasIt = false;
    for(var i = 0; i < arr.length; i++){
        if(arr[i] == rhs){
            hasIt = true;
            index = i;
            break;
        }
    }
    if(!hasIt){
        return res.json({
            errLog: constant.errLog.DbNotFound
        })
    }
}

//                 fo & unfo
//------------------------------------------------
exports.follow = async(function(req, res){
    var userId = reqParser.parseProp(req, 'userId');
    var username = reqParser.parseProp(req, 'username');
    var followingName = reqParser.parseProp(req, 'followingName');

    try{
        var user = userService.getUserByIdOrName(userId, username);
        errHandler.handleNotFound(user, res);
        handleAlreadyHasThisFollowing(user, followingName, res);

        var following = await(UserModel.findOne({name: followingName}).exec());
        errHandler.handleNotFound(following, res);
        handleAlreadyHasThisFan(following, user.name, res);

        user.followings.push(followingName);
        following.followers.push(user.name);

        await(user.save());
        await(following.save());

        return res.json({
            data: user.followings
        })

    }catch(err){
        errHandler.handleDbErr(res);
    }
})


exports.unfollow = async(function (req, res) {
    var userId = reqParser.parseProp(req, 'userId');
    var username = reqParser.parseProp(req, 'username');
    var followingName = reqParser.parseProp(req, 'followingName');


    try{
        var user = userService.getUserByIdOrName(userId, username);
        errHandler.handleNotFound(user, res);
        var followingIndex;
        getIndexOrHandleNotFound(user.followings, followingName, followingIndex, res);

        var following = await(UserModel.findOne({name: followingName}).exec());
        errHandler.handleNotFound(following, res);
        var followerIndex;
        getIndexOrHandleNotFound(following.followers, user.name, followerIndex, res);

        user.followings.splice(followingIndex, 1);
        await(user.save());
        following.followers.splice(followerIndex, 1);
        await(following.save());

        return res.json({
            data: user.followings
        })

    }catch(err){
        errHandler.handleDbErr(res);
    }
})


exports.deleteFollower = async(function(req, res){
    var userId = reqParser.parseProp(req, 'userId');
    var username = reqParser.parseProp(req, 'username');
    var followerName = reqParser.parseProp(req, 'followingName');

    try{
        var user = userService.getUserByIdOrName(userId, username);
        errHandler.handleNotFound(user, res);
        var followerIndex;
        getIndexOrHandleNotFound(user.followers, followerName, followerIndex, res);

        var follower = await(UserModel.findOne({name: followerName}).exec());
        errHandler.handleNotFound(follower, res);
        var followingIndex;
        getIndexOrHandleNotFound(follower.followings, user.name, followingIndex, res);

        user.followers.splice(followerIndex, 1);
        await(user.save());
        follower.followings.splice(followerIndex, 1);
        await(follower.save());

        return res.json({
            data: user.followers
        })


    }catch(err){
        errHandler.handleDbErr(res);
    }
})





