/**
 * Created by Tink on 2015/9/20.
 */

var async = require('asyncawait').async;
var await = require('asyncawait').await;
var reqParser = require('../services/reqParser');
var errHandler = require('../services/errHandler');
var userService = require('../services/user');
var constant = require('../constant');
var PostModel = require('../models').post;
var UserModel = require('../models').user;

exports.pull = async(function(req, res){
    var userId = reqParser.parseProp(req, 'userId');
    var username = reqParser.parseProp(req, 'username');

    try{
        var user = userService.getUserByIdOrName(userId, username);
        errHandler.handleNotFound(user, res);

        //collect self
        var feeds = [];
        for(var i = 0; i < user.posts.length; i++){
            var post = await(PostModel.findById(user.posts[i]).exec());
            errHandler.handleNotFound(post, res);

            feeds.push(post);
        }

        // collect followings
        for(var j = 0; j < user.followings.length; j++){
            var following = await(UserModel.findOne({name: user.followings[j]}).exec());
            errHandler.handleNotFound(following, res);
            for(var k = 0; k < user.posts.length; k++){
                var followingPost = await(PostModel.findById(following.posts[k]).exec());
                errHandler.handleNotFound(followingPost, res);
                feeds.push(followingPost);
            }
        }

        return res.json({
            data: feeds
        })

    }catch(err){
        errHandler.handleDbErr(res);
    }
})

// finally , the feeds structure looks like **feeds:[[], [], []].**
// the first element of every array is the post, its parents following