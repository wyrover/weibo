/**
 * Created by Tink on 2015/9/20.
 */

var UserModel = require('../models').user;
var reqParser = require('../services/reqParser');
var constant = require('../constant');

exports.publish = function(req, res){
    var username = reqParser.parseProp(req, 'username');
    var post = reqParser.parseProp(req, 'post');

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

        doc.posts.push(post);
        doc.save(function(err){
            if(err){
                return res.json({
                    errLog: constant.errLog.DbErr
                });
            }

            console.log(doc);
            return res.json({
                data: doc.posts
            });
        });
    });
}

exports.getAll = function(req, res){
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

        return res.json({
            data: doc.posts
        })
    });
}

exports.deleteOne = function(req, res){
    var username = reqParser.parseProp(req, 'username');
    var postId = reqParser.parseProp(req, 'postId');

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

        doc.posts.splice(postIndex, 1);
        doc.save(function(err){
            if(err){
                return res.json({
                    errLog: constant.errLog.DbErr
                });
            }

            return res.json({
                data: doc.posts
            });
        });
    });
}

exports.up = function (req, res) {
    var username = reqParser.parseProp(req, 'username');
    var postId = reqParser.parseProp(req, 'postId');
    var uper = reqParser.parseProp(req, 'uper');

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
                var post = doc.posts[i];
                for(var u = 0; u < post.ups.length; u++){
                    if(post.ups[u] == uper){
                        return res.json({
                            errLog: constant.errLog.AlreadyExists
                        });
                    }
                }
                break;
            }
        }

        if(!hasThisPost){
            return res.json({
                errLog: constant.errLog.ButItDoesntExist
            });
        }

        doc.posts[postIndex].ups.push(uper);
        doc.save(function(err){
            if(err){
                return res.json({
                    errLog: constant.errLog.DbErr
                });
            }

            return res.json({
                data: doc.posts[postIndex].ups
            });
        });
    });
}

exports.unUp = function(req, res){
    var username = reqParser.parseProp(req, 'username');
    var postId = reqParser.parseProp(req, 'postId');
    var uper = reqParser.parseProp(req, 'uper');

    console.log(username);
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

        var hasThisPostAndUper = false;
        var postIndex;
        var uperIndex;
        for(var i = 0; i < doc.posts.length; i++){
            if(doc.posts[i]._id == postId){
                postIndex = i;
                var post = doc.posts[i];
                for(var u = 0; u < post.ups.length; u++){
                    if(post.ups[u] == uper){
                        hasThisPostAndUper = true;
                        uperIndex = u;
                        break;
                    }
                }
                break;
            }
        }

        if(!hasThisPostAndUper){
            return res.json({
                errLog: constant.errLog.ButItDoesntExist
            });
        }

        doc.posts[postIndex].ups.splice(uperIndex, 1);
        doc.save(function(err){
            if(err){
                return res.json({
                    errLog: constant.errLog.DbErr
                });
            }

            return res.json({
                data: doc.posts[postIndex].ups
            });
        });
    });

}
























