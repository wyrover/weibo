/**
 * Created by Tink on 2015/10/1.
 */

var async = require('asyncawait').async;
var await = require('asyncawait').await;
var UserModel = require('../models').user;

module.exports = {
    getUserByIdOrName: async(function(id, name){
        if(id){
            return await(UserModel.findById(id).exec());
        }
        if(name){
            return await(UserModel.findOne({name: name}).exec());
        }
        return null;
    }),
    getUserByNameOrEmail: async(function (name, email) {
        if (email) {
            return await(UserModel.findOne({email: email}).exec());
        }
        if (name) {
            return await(UserModel.findOne({name: name}).exec());
        }
        return null;
    }),
    getUserByNameOrEmailWithPassword: async(function(name, email, password){
        if(email){
            return await(UserModel.findOne({email: email, password: password}).exec());
        }
        if(name){
            return await(UserModel.findOne({name: username, password: password}).exec());
        }
        return null;
    })
}
