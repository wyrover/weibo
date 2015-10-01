/**
 * Created by Tink on 2015/9/20.
 */

var async = require('asyncawait').async;
var await = require('asyncawait').await;
var utils = require('../services/utils');
var reqParser = require('../services/reqParser');
var errHandler = require('../services/errHandler');
var userService = require('../services/user');
var constant = require('../constant');
var UserModel = require('../models').user;
var PostModel = require('../models').post;

exports.publish = async(function(req, res){
    var userId = reqParser.parseProp(req, 'userId');
    var username = reqParser.parseProp(req, 'username');
    var postId = reqParser.parseProp(req, 'postId');
    var authorId = reqParser.parseProp(req, 'authorId');
    var authorName = reqParser.parseProp(req, 'authorName');
    var comment = reqParser.parseProp(req, 'comment');

    try{
        //var user = userService.getUserByIdOrName(userId, username);
        //errHandler.handleNotFound(user, res);
        //var postIndex;
        //utils.getIndexOrHandleNotFound(user.posts, postId, postIndex, res);
        //todo notifications

        var post = await(PostModel.findById(postId).exec());
        errHandler.handleNotFound(post, res);

        var author = userService.getUserByIdOrName(authorId, authorName);
        errHandler.handleNotFound(author, res);
        comment.author = author.name;
        post.comments.push(comment);
        await(post.save());

        return res.json({
            data: post
        })

    }catch(err){
        errHandler.handleDbErr(res);
    }
})

exports.deleteOne = async(function(req,res){
    var userId = reqParser.parseProp(req, 'userId');
    var username = reqParser.parseProp(req, 'username');
    var postId = reqParser.parseProp(req, 'postId');
    var commentId = reqParser.parseProp(req, 'commentId');


    try{
        var post = await(PostModel.findById(postId).exec());
        errHandler.handleNotFound(post, res);
        var commentIndex;
        utils.getIndexWithPropOrHandleNotFound(post.comments, '_id', commentId, commentIndex, res);

        post.comments.splice(commentIndex, 1);
        await(post.save());

        return res.json({
            data: post
        })

    }catch(err){
        errHandler.handleDbErr(res);
    }
})

exports.up = async(function(req, res){
    var userId = reqParser.parseProp(req, 'userId');
    var username = reqParser.parseProp(req, 'username');
    var postId = reqParser.parseProp(req, 'postId');
    var commentId = reqParser.parseProp(req, 'commentId');
    var uper = reqParser.parseProp(req, 'uper');

    try{
        var post = await(PostModel.findById(postId).exec());
        errHandler.handleNotFound(post, res);
        var commentIndex;
        utils.getIndexWithPropOrHandleNotFound(post.comments, '_id', commentId, commentIndex, res);

        var ups = post.comments[commentIndex].ups;
        if(ups.some(function(u){
                return u == uper;
            })){
            return res.json({
                errLog: constant.errLog.AlreadyExists
            })
        }else{
            post.comments[commentIndex].ups.push(uper);
        }
        await(post.save());

        return res.json({
            data: post.comments[commentIndex].ups
        })
    }catch(err){
        errHandler.handleDbErr(res);
    }
})





// 写到这里













exports.unUp = function(req, res){
    var username = reqParser.parseProp(req, 'username');
    var postId = reqParser.parseProp(req, 'postId');
    var uper = reqParser.parseProp(req, 'uper');

    UserModel.findOne({name: username}, function(err, doc){
        if (err) {
            return res.json({
                errLog: constant.errLog.DbErr
            });
        }

        if (!doc) {
            return res.json({
                errLog: constant.errLog.DbNotFound
            });
        }

        var hasThisPostThisCommentAndThisUper = false;
        var postIndex;
        var commentIndex;
        var uperIndex;
        for(var i = 0; i < doc.posts.length; i++){
            if(doc.posts[i]._id == postId){
                postIndex = i;
                var post = doc.posts[i];
                for(var j = 0; j < post.comments.length; j++){
                    if(post.comments[j] == commentId){
                        commentIndex = j;
                        for(var u = 0; u < post.comments[j].ups.length; u++){
                            if(post.comments[j].ups[u] == uper){
                                uperIndex = u;
                                hasThisPostThisCommentAndThisUper = true;
                                break;
                            }
                        }
                        break;
                    }
                }
                break;
            }
        }

        if(!hasThisPostThisCommentAndThisUper){
            return res.json({
                errLog: constant.errLog.ButItDoesntExist
            });
        }

        doc.posts[postIndex].comments[commentIndex].ups.splice(uperIndex, 1);
        doc.save(function(err){
            if (err) {
                return res.json({
                    errLog: constant.errLog.DbErr
                });
            }

            return res.json({
                data: doc.post[postIndex].comments[commentIndex].ups
            });
        });
    });
}