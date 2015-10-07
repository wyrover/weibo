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
    var parentComment = reqParser.parseProp(req, 'parentComment');
    var authorId = reqParser.parseProp(req, 'authorId');
    var authorName = reqParser.parseProp(req, 'authorName');
    var comment = reqParser.parseProp(req, 'comment');

    try{
        var user = await(userService.getUserByIdOrName(userId, username));
        errHandler.handleNotFound(user, res);

        var post = await(PostModel.findById(postId).exec());
        errHandler.handleNotFound(post, res);

        if(parentComment){
            var pcAuthor = await(UserModel.findOne({name: parentComment.author}).exec());
            comment.parentAuthor = pcAuthor.name;
            errHandler.handleNotFound(pcAuthor, res);
        }

        var author = await(userService.getUserByIdOrName(authorId, authorName));
        errHandler.handleNotFound(author, res);
        comment.author = author.name;
        post.comments.push(comment);

        var ntfToPoster = {
            actor: author.name,
            verb: constant.logVerb.Comment,
            res: postId,
            resSummary: post.content,
            ref: comment.position,
            refSummary: comment.content,
        };
        user.notifications.push(ntfToPoster);

        if(parentComment){
            var nftToCommenter = {
                actor: author.name,
                verb: constant.logVerb.Reply,
                field: postId,
                fieldSummary: post.content,
                res: parentComment.position,
                resSummary: parentComment.content,
                ref: comment.position,
                refSummary: comment.content
            };
            pcAuthor.notifications.push(nftToCommenter);
            await(pcAuthor.save());
        }
        await(user.save());
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
        var user = await(userService.getUserByIdOrName(userId, username));
        errHandler.handleNotFound(user, res);

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

        var notification = {
            actor: uper,
            verb: constant.logVerb.UpComment,
            field: postId,
            fieldSummary: post.content,
            res: post.comments[commentIndex].position,
            resSummary: post.comments[commentIndex].content,
        };
        user.notifications.push(notification);
        await(user.save());

        await(post.save());

        return res.json({
            data: post.comments[commentIndex].ups
        })
    }catch(err){
        errHandler.handleDbErr(res);
    }
})

exports.unup = async(function(req, res){
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
        var uperIndex;
        utils.getIndexOrHandleNotFound(ups, uper, uperIndex, res);

        post.comments[commentIndex].ups.splice(uperIndex, 1);
        await(post.save());

        return res.json({
            data: post.comments[commentIndex].ups
        })
    }catch(err){
        errHandler.handleDbErr(res);
    }
})