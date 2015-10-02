/**
 * Created by Tink on 2015/10/2.
 */

var async = require('asyncawait').async;
var await = require('asyncawait').await;
var errHandler = require('../services/errHandler');
var constant = require('../constant');
var PostModel = require('../models').post;

var getParent = async(function (post, parents, res) {
    if (post.parent != '') {
        try {
            var parent = await(PostModel.findById(post.parent).exec());
            errHandler.handleNotFound(parent, res);
            parents.push(parent);
        } catch (err) {
            errHandler.handleDbErr(res);
        }
        getParent(parent, parents, res);
    }
})

module.exports = {
    getParents: function (post, res) {
        var results = [];
        getParent(post, results, res);
        return results;
    }
}