/**
 * Created by Tink on 2015/9/20.
 */


var async = require('asyncawait').async;
var await = require('asyncawait').await;
var reqParser = require('../services/reqParser');
var errHandler = require('../services/errHandler');
var userService = require('../services/user');
var postService = require('../services/post');
var constant = require('../constant');
var PostModel = require('../models').post;
var UserModel = require('../models').user;


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


//                 post & repost
//------------------------------------------------
exports.publish = async(function(req, res){
    var userId = reqParser.parseProp(req, 'userId');
    var username = reqParser.parseProp(req, 'username');
    var post = reqParser.parseProp(req, 'post');

    try{
        var user = await(userService.getUserByIdOrName(userId, username));
        errHandler.handleNotFound(user, res);

        post.author = user.name;
        var newPost = await(PostModel.create(post));
        user.posts.push(newPost._id);

        if(newPost.parent !== ''){
            var parentPost = await(PostModel.findById(newPost.parent).exec());
            var parentAuthor = await(UserModel.findOne({name: newPost.author}).exec());
            var notification = {
                actor: user.name,
                verb: constant.logVerb.Repost,
                res: parentPost._id,
                resSummary: parentPost.content,
                ref: newPost._id,
                refSummary: newPost.content
            }
            parentAuthor.notifications.push(notification);
            await(parentAuthor.save());
        }

        await(user.save());

        return res.json({
            data: {
                posts: user.posts,
                post: newPost
            }
        })
    }catch(err){
        errHandler.handleDbErr(res);
    }
})

exports.getOne = async(function(req, res){
    var postId = reqParser.parseProp(req, 'postId');

    try{
        var post = await(PostModel.findById(postId).exec());
        errHandler.handleNotFound(post, res);
        var parents = postService.getParents(post, res);

        return res.json({
            data: {
                post: post,
                parents: parents
            }
        })

    }catch(err){
        errHandler.handleDbErr(res);
    }
})

exports.getOnesAll = async(function(req, res){
    var userId = reqParser.parseProp(req, 'userId');
    var username = reqParser.parseProp(req, 'username');

    try{
        var user = await(userService.getUserByIdOrName(userId, username));
        errHandler.handleNotFound(user, res);

        var posts = [];
        for(var i = 0; i < user.posts.length; i++){
            var post = await(PostModel.findById(user.posts[i]).exec());
            errHandler.handleNotFound(post, res);
            var parents = postService.getParents(post, res);
            var feed = {
                post: post,
                parents: parents
            }
            posts.push(feed);
        }
        return res.json({
            data: posts
        })
    }catch(err){
        errHandler.handleDbErr(res);
    }
})

//really deleted
exports.deleteOne = async(function(req, res){
    var userId = reqParser.parseProp(req, 'userId');
    var username = reqParser.parseProp(req, 'username');
    var postId = reqParser.parseProp(req, 'postId');

    try{
        var user = await(userService.getUserByIdOrName(userId, username));
        errHandler.handleNotFound(user, res);
        var postIndex;
        getIndexOrHandleNotFound(user.posts, postId, postIndex, res);
        user.posts.splice(postIndex, 1);
        await(user.save());

        var post = await(PostModel.findByIdAndRemove(postId).exec());
        errHandler.handleNotFound(post, res);

        return res.json({
            data: user.posts
        })
    }catch(err){
        errHandler.handleDbErr(res);
    }
})

// not really deleted
exports.deleteOneJustInUserPosts = async(function(req, res){
    var userId = reqParser.parseProp(req, 'userId');
    var username = reqParser.parseProp(req, 'username');
    var postId = reqParser.parseProp(req, 'postId');

    try{
        var user = await(userService.getUserByIdOrName(userId, username));
        errHandler.handleNotFound(user, res);
        var postIndex;
        getIndexOrHandleNotFound(user.posts, postId, postIndex, res);
        user.posts.splice(postIndex, 1);
        await(user.save());

        return res.json({
            data: user.posts
        })
    }catch(err){
        errHandler.handleDbErr(res);
    }
})

//                 up & unup
//------------------------------------------------
exports.up = async(function (req, res) {
    var userId = reqParser.parseProp(req, 'userId');
    var username = reqParser.parseProp(req, 'username');
    var postId = reqParser.parseProp(req, 'postId');
    var uper = reqParser.parseProp(req, 'uper');

    try{
        var user = await(userService.getUserByIdOrName(userId, username));
        errHandler.handleNotFound(user, res);
        var postIndex;
        getIndexOrHandleNotFound(user.posts, postId, postIndex, res);

        var post = await(PostModel.findById(postId).exec());
        errHandler.handleNotFound(post, res);
        if(post.ups.some(function(u){
                return u == uper;
        })){
            return res.json({
                errLog: constant.errLog.AlreadyExists
            })
        }else{
            post.ups.push(uper);
        }

        var notification = {
            actor: uper,
            verb: constant.logVerb.UpPost,
            res: postId,
            resSummary: post.content
        };
        user.notifications.push(notification);
        await(user.save());

        await(post.save());

        return res.json({
            data: post
        })

    }catch(err){
        errHandler.handleDbErr(res);
    }
})

exports.unup = async(function(req, res){
    var userId = reqParser.parseProp(req, 'userId');
    var username = reqParser.parseProp(req, 'username');
    var postId = reqParser.parseProp(req, 'postId');
    var uper = reqParser.parseProp(req, 'uper');


    try{
        var user = await(userService.getUserByIdOrName(userId, username));
        errHandler.handleNotFound(user, res);
        var postIndex;
        getIndexOrHandleNotFound(user.posts, postId, postIndex, res);

        var post = await(PostModel.findById(postId).exec());
        errHandler.handleNotFound(post, res);
        var uperIndex;
        getIndexOrHandleNotFound(post.ups, uper, uperIndex, res);

        post.ups.splice(uperIndex, 1);
        await(post.save());
        return res.json({
            data: post
        })

    }catch(err){
        errHandler.handleDbErr(res);
    }
})
























