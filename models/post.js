
/**
 * Created by Tink on 2015/9/19.
 */


var Schema = require('mongoose').Schema;
var constant = require('../constant');

var Comment = new Schema({
    author      : String,
    content     : String,
    position    : String, // 评论楼层
    createDate  : {type: Date, default: Date.now},
    ups         : [String], //name
    parent      : {type: String, default: ''}, // 跟评的原po
});


var Post = new Schema({
    author      : String,
    content     : String,
    pics        : [Buffer], // 图片
    createDate  : {type: Date, default: Date.now},
    comments    : [Comment],
    ups         : [String],
    parent      : {type: String, default: ''}, // ԭ原po的用户名
});

var Notification = new Schema({
    actor       : String,
    recipient   : String,
    verb        : String,
    field       : String,
    fieldSummary: String,
    res         : String, // 资源
    resSummary  : String,
    ref         : String, // 引用
    refSummary  : String, //
    status      : {type: Number, default: constant.notificationStatus.New}, // 状态
    createDate  : {type: Date, default: Date.now()},
    //content     : String

})

module.exports = {
    comment     : Comment,
    post        : Post,
    notification: Notification
}

