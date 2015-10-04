/**
 * Created by Tink on 2015/9/19.
 */

var Schema = require('mongoose').Schema;
var constant = require('../constant');

// 权限: 受限资源及操作动作
var Permission = new Schema({
    resource        : String,
    action          : {type: String, default: constant.permissionAction.READ_ONLY},
    desc            : {type: String, default: '' }
});

// 角色, 每个用户依赖一个角色,
var Role = new Schema({
    type            : String,
    permissions     : [Permission]
});

var User = new Schema({
    name            : String,
    password        : String,
    email           : String, // non-undefined
    avatar          : Buffer, //todo Specify a default graphics
    bee             : {type: Number, default: 0},
    role            : {type: String, default: constant.roleType.Unchecked},
    signature       : {type: String, default: '' },
    followers       : [String], //粉丝
    followings      : [String], //关注
    createDate      : {type: Date, default: Date.now},
    posts           : [String],
    notifications   : [String]
});

module.exports = {
    permission      : Permission,
    role            : Role,
    user            : User
}
