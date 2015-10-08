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
    if(post.toObject().hasOwnProperty('parent')){
        var pre = post.parent;
    }else{
        return results;
    }
    while(pre){
        var parent = await(PostModel.findById(pre).exec());
        if(parent){
            results.push(parent);
            pre = parent.parent;
        }else{
            pre = null;
        }

    }
    return results;
})