/**
 * Created by Tink on 2015/9/21.
 */

var async = require('asyncawait').async;
var await = require('asyncawait').await;
var utils = require('../services/utils');
var reqParser = require('../services/reqParser');
var errHandler = require('../services/errHandler');
var constant = require('../constant');
var RoleModel = require('../models').role;
var PermissionModel = require('../models').permission;

exports.create = async(function(req, res){
    var resource = reqParser.parseProp(req, 'resource');
    var action = reqParser.parseProp(req, 'action');

    try{
        var existed = await(PermissionModel.findOne({resource: resource, action: action}).exec());
        errHandler.handleAlreadyExists(existed, res);

        var permission = {};
        permission.resource = resource;
        permission.action = action;
        var result = await(PermissionModel.create(permission));

        return res.json({
            data: result
        })

    }catch(err){
        errHandler.handleDbErr(res);
    }
})

exports.getAll = async(function(req, res){
    try{
        var permissions = await(PermissionModel.find().exec());
        return res.json({
            data: permissions
        })

    }catch(err){
        errHandler.handleDbErr(res);
    }
})

exports.delete = async(function(req, res){
    var resource = reqParser.parseProp(req, 'resource');
    var action = reqParser.parseProp(req, 'action');

    try{
        var permission = await(PermissionModel.findOneAndRemove({resource: resource, action: action}).exec());
        errHandler.handleNotFound(permission, res);

        var roles = await(RoleModel.find().exec());
        for(var i = 0; i < roles.length; i++){
            for(var j = 0; j < roles[i].permissions.length; j++){
                if(roles[i].permissions[j].resource == resource){
                    var role = await(RoleModel.findById(roles[i]._id).exec());
                    role.permissions.splice(j, 1);
                    await(role.save());
                }
            }
        }
        return res.json({
            data: true
        })
    }catch(err){
        errHandler.handleDbErr(res);
    }
})