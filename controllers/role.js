/**
 * Created by Tink on 2015/9/20.
 */

var RoleModel = require('../models').role;
var reqParser = require('../services/reqParser');
var constant = require('../constant');

exports.get = function(req, res){
    var type = reqParser.parseProp(req, 'roleType');

    RoleModel.findOne({type: type}, function(err, doc){
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

        return res.json({
            data: doc
        })

    });
}

exports.create = function(req, res){
    console.log(res.body);
    var type = reqParser.parseProp(req, 'roleType');
    console.log(type);

    RoleModel.findOne({type: type}, function(err, doc){
        if(err){
            return res.json({
                errLog: constant.errLog.DbErr
            });
        }

        if(doc){
            return res.json({
                errLog: constant.errLog.AlreadyExists
            });
        }

        var role = {};
        role.type = type;
        RoleModel.create(role, function(err, docx){
            if(err){
                return res.json({
                    errLog: constant.errLog.DbErr
                });
            }

            return res.json({
                data: docx
            });
        });
    });
}

exports.update = function(req, res){
    var type = reqParser.parseProp(req, 'roleType');
    var newType = reqParser.parseProp(req, 'newType');
    var newPermissions = reqParser.parseProp(req, 'newPermissions');

    RoleModel.findOne({type: type}, function(err, doc){
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

        // Q: why not validate them before?
        // A: If u want to only update either of type or permissions, validate prop is necessary.
        var eitherIsValid = false;
        if(typeof newType != 'undefined'){
            doc.type = newType;
            eitherIsValid = true;
        }

        if(typeof newPermissions != 'undefined'){
            doc.permissions = newPermissions;
            eitherIsValid = true;
        }

        if(eitherIsValid){
            doc.save(function(err){
                return res.json({
                    data: doc
                });
            });
        }
    });
}