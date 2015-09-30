/**
 * Created by Tink on 2015/9/20.
 */

var UserModel = require('../models').user;
var reqParser = require('../services/reqParser');
var constant = require('../constant');

exports.pull = function(req, res){
    var username = reqParser.parseProp(req, 'username');

    UserModel.findOne({name: username} , function(err, doc){
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

        var feeds = [];
        feeds = feeds.concat(doc.posts);
        if(doc.followings.length == 0){
            return res.json({
                data: feeds
            });
        }

        var followingsCount = 0;
        for(var i = 0; i < doc.followings.length; i++){
            UserModel.findOne({name: doc.followings[followingsCount]}, function(err, docx){
                feeds = feeds.concat(docx.posts);
                if(followingsCount+1 >= doc.followings.length){
                    return res.json({
                        data: feeds
                    });
                }
                followingsCount++;
            });
        }
    });
}