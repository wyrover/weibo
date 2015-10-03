/**
 * Created by Tink on 2015/9/20.
 */

var async = require('asyncawait').async;
var await = require('asyncawait').await;
var reqParser = require('../services/reqParser');
var errHandler = require('../services/errHandler');
var userService = require('../services/user');
var constant = require('../constant');
var UserModel = require('../models').user;


exports.sendMessage = async(function(req, res){
    var senderId = reqParser.parseProp(req, 'senderId');
    var senderName = reqParser.parseProp(req, 'senderName');
    var content = reqParser.parseProp(req, 'content');
    var receiverName = reqParser.parseProp(req, 'receiver');

    try{
        var sender = userService.getUserByIdOrName(senderId, senderName);
        errHandler.handleNotFound(sender, res);

        var receiver = await(UserModel.findOne({name: receiverName}).exec());
        errHandler.handleNotFound(receiver, res);

        var notification = {
            actor: sender.name,
            verb: constant.logVerb.SendMessage,
            refSummary: content
        };
        receiver.notifications.push(notification);

        await(receiver.save());

        return res.json({
            data: true
        })
    }catch(err){
        errHandler.handleDbErr(res);
    }
})