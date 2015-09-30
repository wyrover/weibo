
/**
 * Created by Tink on 2015/9/19.
 */


var Schema = require('mongoose').Schema;
var constant = require('../constant');

var Comment = new Schema({
    author      : String,
    content     : String,
    //position    : String, // 评论楼层
    createDate  : {type: Date, default: Date.now},
    ups         : [String],
    parent      : {type: String, default: ''}, // 跟评的原po
});


var Post = new Schema({
    author      : String,
    content     : String,
    pics        : [Buffer], // 图片
    createDate  : {type: Date, default: Date.now},
    comments    : [String],
    ups         : [String],
    parent      : {type: String, default: ''}, // ԭ原po的用户名
});

var Notification = new Schema({
    guest       : String,
    field       : String,
    fieldLink   : String,
    verb        : String,
    res         : String,
    resLink     : String,
    order       : Number, // 语序
    status      : {type: Number, default: constant.notificationStatus.New}, // 状态
    createDate  : {type: Date, default: Date.now()}

})

module.exports = {
    comment     : Comment,
    post        : Post,
    notification: Notification
}

