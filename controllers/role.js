/**
 * Created by Tink on 2015/9/20.
 */

var async = require('asyncawait').async;
var await = require('asyncawait').await;
var reqParser = require('../services/reqParser');
var errHandler = require('../services/errHandler');
var constant = require('../constant');
var RoleModel = require('../models').role;
var PermissionModel = require('../models').permission;


exports.create = async(function(req, res){
    var type = reqParser.parseProp(req, 'roleType');

    try{
        var existed = await(RoleModel.findOne({type: type}).exec());
        errHandler.handleAlreadyExists(existed, res);

        var role = {};
        role.type = type;
        await(RoleModel.create(role));

        return res.json({
            data: role
        })


    }catch(err){
        errHandler.handleDbErr(res);
    }
});

exports.get = async(function(req, res){
    var type = reqParser.parseProp(req, 'roleType');

    try{
        var role = await(RoleModel.findOne({type: type}).exec());
        errHandler.handleNotFound(role, res);

        return res.json({
            data: role
        })
    }catch(err){
        errHandler.handleDbErr(res);
    }
});

exports.getAll = async(function(req, res){

    try{
        var roles = await(RoleModel.find().exec());
        return res.json({
            data: roles
        })
    }catch(err){
        errHandler.handleDbErr(res);
    }
});

exports.changeName = async(function(req, res){
    var type = reqParser.parseProp(req, 'roleType');
    var newType = reqParser.parseProp(req, 'newType');

    try{
        var role = await(RoleModel.findOne({type: type}).exec());
        errHandler.handleNotFound(role, res);

        role.type = newType;
        await(role.save());

        return res.json({
            data: role
        })

    }catch(err){
        errHandler.handleDbErr(res);
    }
});

exports.delete = async(function(req, res){
    var type = reqParser.parseProp(req, 'roleType');

    try{
        var role = await(RoleModel.findOneAndRemove({type: type}).exec());
        errHandler.handleNotFound(role, res);

        return res.json({
            data: role
        })
    }catch(err){
        errHandler.handleDbErr(res);
    }
});

//              permission
//---------------------------------------

exports.addPermission = async(function(req, res){
    var type = reqParser.parseProp(req, 'roleType');
    var resource = reqParser.parseProp(req, 'resource');
    var action = reqParser.parseProp(req, 'action');

    try{
        var role = await(RoleModel.findOne({type: type}).exec());
        errHandler.handleNotFound(role, res);

        var permission = await(PermissionModel.findOne({resource: resource, action: action}).exec());
        errHandler.handleNotFound(permission, res);

        utils.pushToArrayMatchPropOrHandleAlreadyExists(role.permissions, 'resource', permission, res);
        await(role.save());

        return res.json({
            data: role.permissions
        })

    }catch(err){
        errHandler.handleDbErr(res);
    }
})

exports.deletePermission = async(function(req, res){
    var type = reqParser.parseProp(req, 'roleType');
    var permission = reqParser.parseProp(req, 'permission');

    try{
        var role = await(RoleModel.findOne({type: type}).exec());
        errHandler.handleNotFound(role, res);
        var permissionIndex;
        utils.getIndexWithPropOrHandleNotFound(role.permissions, 'resource', permission, permissionIndex, res);

        role.permissions.splice(permissionIndex, 1);
        await(role.save());

        return res.json({
            data: role.permissions
        })
    }catch(err){
        errHandler.handleDbErr(res);
    }
})