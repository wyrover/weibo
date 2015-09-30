/**
 * Created by Tink on 2015/9/20.
 */

var UserModel = require('../models').user;
var reqParser = require('../services/reqParser');
var constant = require('../constant');

exports.follow = function(req, res){
    var username = reqParser.parseProp(req, 'username');
    var followingName = reqParser.parseProp(req, 'followingName');

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

        for(var i = 0; i < doc.followings.length; i++){
            if(doc.followings[i] == followingName){
                return res.json({
                    errLog: constant.errLog.AlreadyExists
                });
            }
        }

        UserModel.findOne({name: followingName}, function(err, docx){
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

            for(var j = 0; j < docx.followers.length; j++){
                if(docx.followers[j] == username){
                    return res.json({
                        errLog: constant.errLog.AlreadyExists
                    });
                }
            }

            doc.followings.push(followingName);
            doc.save(function(err){
                if(err){
                    return res.json({
                        errLog: constant.errLog.DbErr
                    });
                }

                docx.followers.push(username);
                //var newFollowerNotification = {};
                //newFollowerNotification.guest = username;
                //newFollowerNotification.
                docx.save(function(err){
                    if(err){
                        return res.json({
                            errLog: constant.errLog.DbErr
                        });
                    }

                    return res.json({
                        data: doc.followings
                    });
                });
            });
        });
    });
}


exports.unFollow = function (req, res) {
    var username = reqParser.parseProp(req, 'username');
    var followingName = reqParser.parseProp(req, 'followingName');

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

        var hasThisFollowing = false;
        var followingIndex;
        for(var i = 0; i < doc.followings.length; i++){
            if(doc.followings[i] == followingName){
                hasThisFollowing = true;
                followingIndex = i;
                break;
            }
        }

        if(!hasThisFollowing){
            console.log('Not have this following');
            return res.json({
                errLog: constant.errLog.ButItDoesntExist
            })
        }

        UserModel.findOne({name: followingName}, function(err, docx){
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

            var hasThisFollower = false;
            var followerIndex;
            for(var j = 0; j < docx.followers.length; j++){
                if(docx.followers[j] == username){
                    hasThisFollower = true;
                    followerIndex = j;
                    break;
                }
            }

            if(!hasThisFollower){
                return res.json({
                    errLog: constant.errLog.ButItDoesntExist
                });
            }

            doc.followings.splice(followingIndex, 1);
            doc.save(function(err){
                if(err){
                    return res.json({
                        errLog: constant.errLog.DbErr
                    });
                }

                docx.followers.splice(followerIndex, 1);
                docx.save(function(err){
                    if(err){
                        return res.json({
                            errLog: constant.errLog.DbErr
                        });
                    }

                    return res.json({
                        data: doc.followings
                    });
                });
            });
        });
    });
}

exports.deleteFollower = function(req, res){
    var username = reqParser.parseProp(req, 'username');
    var followerName = reqParser.parseProp(req, 'followingName')

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

        var hasThisFollower = false;
        var followerIndex;
        for(var i = 0; i < doc.followers.length; i++){
            if(doc.followers[i] == followerName){
                hasThisFollower = true;
                followerIndex = i;
                break;
            }
        }

        if(!hasThisFollower){
            return res.json({
                errLog: constant.errLog.ButItDoesntExist
            })
        }

        UserModel.findOne({name: followerName}, function(err, docx){
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

            var hasThisFollowing = false;
            var followingIndex;
            for(var j = 0; j < docx.followings.length; j++){
                if(docx.followings[j] == username){
                    hasThisFollowing = true;
                    followingIndex = j;
                    break;
                }
            }

            if(!hasThisFollowing){
                return res.json({
                    errLog: constant.errLog.ButItDoesntExist
                });
            }

            doc.followers.splice(followerIndex, 1);
            doc.save(function(err){
                if(err){
                    return res.json({
                        errLog: constant.errLog.DbErr
                    });
                }

                docx.followings.splice(followingIndex, 1);
                docx.save(function(err){
                    if(err){
                        return res.json({
                            errLog: constant.errLog.DbErr
                        });
                    }

                    return res.json({
                        data: doc.followers
                    });
                });
            });
        });
    });
}





