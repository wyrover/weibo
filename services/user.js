/**
 * Created by Tink on 2015/10/1.
 */

var async = require('asyncawait').async;
var await = require('asyncawait').await;
var UserModel = require('../models').user;

module.exports = {
    getUserByIdOrName: function(id, name){
        if(id){
            return UserModel.findById(id).exec();
        }
        if(name){
            return UserModel.findOne({name: name}).exec();
        }
        return null;
    },
    getUserByNameOrEmail: function (name, email) {
        if (email) {
            return UserModel.findOne({email: email}).exec();
        }
        if (name) {
            return UserModel.findOne({name: name}).exec();
        }
        return null;
    },
    getUserByNameOrEmailWithPassword: function(name, email, password){
        if(email){
            return UserModel.findOne({email: email, password: password}).exec();
        }
        if(name){
            return UserModel.findOne({name: name, password: password}).exec();
        }
        return null;
    }
}
