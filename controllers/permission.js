/**
 * Created by Tink on 2015/9/21.
 */

var RoleModel = require('../models').role;
var reqParser = require('../services/reqParser');
var constant = require('../constant');

exports.add = function(req, res){
    var type = reqParser.parseProp(req, 'roleType');
    var permission = reqParser.parseProp(req, 'permission');

    RoleModel.findOne({type: type}, function(err, doc) {
        if (err) {
            return res.json({
                errLog: constant.errLog.DbErr
            });
        }

        if (!doc) {
            return res.json({
                errLog: constant.errLog.DbNotFound
            });
        }

        for(var i = 0; i < doc.permissions.length; i++){
            if(doc.permissions[i].resource == permission.resource){
                return res.json({
                    errLog: constant.errLog.AlreadyExists
                });
            }
        }

        doc.permissions.push(permission);
        doc.save(function(err){
            if (err) {
                return res.json({
                    errLog: constant.errLog.DbErr
                });
            }

            return res.json({
                data: doc.permissions
            });
        });
    });
}

exports.deleteOne = function(req, res){
    var type = reqParser.parseProp(req, 'roleType');
    var permission = reqParser.parseProp(req, 'permission');

    RoleModel.findOne({type: type}, function(err, doc) {
        if (err) {
            return res.json({
                errLog: constant.errLog.DbErr
            });
        }

        if (!doc) {
            return res.json({
                errLog: constant.errLog.DbNotFound
            });
        }


        var hasThisPermission = false;
        var permissionIndex;
        for(var i = 0; i < doc.permissions.length; i++){
            if(doc.permissions[i].resource == permission.resource){
                hasThisPermission = true;
                permissionIndex = i;
                break;
            }
        }

        if(!hasThisPermission){
            return res.json({
                errLog: constant.errLog.ButItDoesntExist
            });
        }

        doc.permissions.splice(permissionIndex, 1);
        doc.save(function(err){
            if (err) {
                return res.json({
                    errLog: constant.errLog.DbErr
                });
            }

            return res.json({
                data: doc.permissions
            });
        });
    });
}

exports.update = function(req, res){
    var type = reqParser.parseProp(req, 'roleType');
    var permission = reqParser.parseProp(req, 'permission');

    RoleModel.findOne({type: type}, function(err, doc) {
        if (err) {
            return res.json({
                errLog: constant.errLog.DbErr
            });
        }

        if (!doc) {
            return res.json({
                errLog: constant.errLog.DbNotFound
            });
        }

        for(var i = 0; i < doc.permissions.length; i++){
            if(doc.permissions[i].resource == permission.resource){
                doc.permissions[i] = permission;
                doc.save(function(err){
                    if (err) {
                        return res.json({
                            errLog: constant.errLog.DbErr
                        });
                    }

                    return res.json({
                        data: doc.permissions
                    });
                });
            }
        }

        return res.json({
            errLog: constant.errLog.ButItDoesntExist
        });
    });
}

exports.deleteAll = function(req, res){
    var type = reqParser.parseProp(req, 'roleType');

    RoleModel.findOne({type: type}, function(err, doc) {
        if (err) {
            return res.json({
                errLog: constant.errLog.DbErr
            });
        }

        if (!doc) {
            return res.json({
                errLog: constant.errLog.DbNotFound
            });
        }

        doc.permissions = [];

        doc.save(function(err){
            if (err) {
                return res.json({
                    errLog: constant.errLog.DbErr
                });
            }

            return res.json({
                data: doc
            });
        });
    });
}