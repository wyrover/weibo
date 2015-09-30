/**
 * Created by Tink on 2015/9/20.
 */

var UserModel = require('../models').user;
var reqParser = require('../services/reqParser');
var constant = require('../constant');

exports.publish = function(req, res){
    var username = reqParser.parseProp(req, 'username');
    var postId = reqParser.parseProp(req, 'postId');
    var comment = reqParser.parseProp(req, 'comment');

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

        var hasThisPost = false;
        var postIndex;
        for(var i = 0; i < doc.posts.length; i++){
            if(doc.posts[i]._id == postId){
                hasThisPost = true;
                postIndex = i;
                break;
            }
        }

        if(!hasThisPost){
            return res.json({
                errLog: constant.errLog.ButItDoesntExist
            });
        }

        doc.posts[postIndex].comments.push(comment);
        doc.save(function(err){
            if(err){
                return res.json({
                    errLog: constant.errLog.DbErr
                });
            }

            return res.json({
                data: doc.posts[postIndex].comments
            });
        });
    });
}

exports.getAll = function(req, res){
    var username = reqParser.parseProp(req, 'username');
    var postId = reqParser.parseProp(req, 'postId');

    UserModel.findOne({name: username}, function(err, doc) {
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

        var hasThisPost = false;
        for(var i = 0; i < doc.posts.length; i++){
            if(doc.posts[i]._id == postId){
                hasThisPost = true;
                return res.json({
                    data: doc.posts[i].comments
                });
            }
        }

        if(!hasThisPost){
            return res.json({
                errLog: constant.errLog.ButItDoesntExist
            });
        }

    });
}

exports.deleteOne = function(req,res){
    var username = reqParser.parseProp(req, 'username');
    var postId = reqParser.parseProp(req, 'postId');
    var commentId = reqParser.parseProp(req, 'commentId');

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

        var hasThisPostAndThisComment = false;
        var postIndex;
        var commentIndex;
        for(var i = 0; i < doc.posts.length; i++){
            if(doc.posts[i]._id == postId){
                postIndex = i;
                var post = doc.posts[i];
                for(var j = 0; j < post.comments.length; j++){
                    if(post.comments[j] == commentId){
                        hasThisPostAndThisComment = true;
                        commentIndex = j;
                        break;
                    }
                }
                break;
            }
        }

        if(!hasThisPostAndThisComment){
            return res.json({
                errLog: constant.errLog.ButItDoesntExist
            });
        }

        doc.posts[postIndex].comments.splice(commentIndex, 1);
        doc.save(function(err){
            if (err) {
                return res.json({
                    errLog: constant.errLog.DbErr
                });
            }

            return res.json({
                data: doc.post[postIndex].comments
            });
        });
    });
}

exports.up = function(req, res){
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

        var hasThisPostAndThisComment = false;
        var postIndex;
        var commentIndex;
        for(var i = 0; i < doc.posts.length; i++){
            if(doc.posts[i]._id == postId){
                postIndex = i;
                var post = doc.posts[i];
                for(var j = 0; j < post.comments.length; j++){
                    if(post.comments[j] == commentId){
                        hasThisPostAndThisComment = true;
                        commentIndex = j;
                        for(var u = 0; u < post.comments[j].ups.length; u++){
                            if(post.comments[j].ups[u] == uper){
                                return res.json({
                                    errLog: constant.errLog.AlreadyExists
                                });
                            }
                        }
                        break;
                    }
                }
                break;
            }
        }

        if(!hasThisPostAndThisComment){
            return res.json({
                errLog: constant.errLog.ButItDoesntExist
            });
        }

        doc.posts[postIndex].comments[commentIndex].ups.push(uper);
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