/**
 * Created by Tink on 2015/10/2.
 */

var async = require('asyncawait').async;
var await = require('asyncawait').await;
var errHandler = require('../services/errHandler');
var constant = require('../constant');
var PostModel = require('../models').post;

exports.getParents = async(function (post){
    var results = [];
    if(post.hasOwnProperty('parent')){
        var next = post.parent;
    }else{
        return results;
    }
    while(next){
        var parent = await(PostModel.findById(post.parent).exec());
        if(parent){
            results.push(parent);
            next = parent.parent;
        }
        next = null;
    }
    return results;
})