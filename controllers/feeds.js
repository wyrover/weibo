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

var packFeedToFeeds = async(function(post, feeds){
    var parents = await(postService.getParents(post));
    var origin = undefined;
    if(parents.length > 0){
        origin = parents[parents.length-1];
        parents.splice(parents.length-1, 1);
    }

    var feed = {
        post: post,
        parents: parents,
        origin: origin
    }
    feeds.push(feed);
})

exports.pull = async(function(req, res){
    var userId = reqParser.parseProp(req, 'userId');
    var username = reqParser.parseProp(req, 'username');

    try{
        var user = await(userService.getUserByIdOrName(userId, username));
        errHandler.handleNotFound(user, res);

        var feeds = [];
        for(var i = 0; i < user.posts.length; i++){
            var post = await(PostModel.findById(user.posts[i]).exec());
            errHandler.handleNotFound(post, res);
            await(packFeedToFeeds(post, feeds));
        }

        for(var j = 0; j < user.followings.length; j++){
            var following = await(UserModel.findOne({name: user.followings[j]}).exec());
            errHandler.handleNotFound(following, res);
            for(var k = 0; k < following.posts.length; k++){
                var followingPost = await(PostModel.findById(following.posts[k]).exec());
                await(packFeedToFeeds(followingPost, feeds));
            }
        }

        return res.json({
            data: feeds
        })

    }catch(err){
        errHandler.handleDbErr(res);
    }
})

// finally , the feeds structure looks like **feeds:[{post, parents}, {post, parents}, {post, parents}].**
// the first element of every array is the post, its parents following