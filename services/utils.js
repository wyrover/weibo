/**
 * Created by Tink on 2015/10/1.
 */

var constant = require('../constant');

module.exports = {
    getIndexOrHandleNotFound: function(arr, rhs, index, res){
        var hasIt = false;
        for(var i = 0; i < arr.length; i++){
            if(arr[i] == rhs){
                hasIt = true;
                index = i;
                break;
            }
        }
        if(!hasIt){
            return res.json({
                errLog: constant.errLog.DbNotFound
            })
        }
    },
    getIndexWithPropOrHandleNotFound: function(arr, prop, rhs, index, res){
        var hasIt = false;
        for(var i = 0; i < arr.length; i++){
            if(arr[i][prop] == rhs){
                hasIt = true;
                index = i;
                break;
            }
        }
        if(!hasIt){
            return res.json({
                errLog: constant.errLog.DbNotFound
            })
        }
    },
    pushToArrayMatchPropOrHandleAlreadyExists: function(arr, prop, insert, res){
        if(arr.some(function(element){
                return element[prop] == insert[prop];
            })){
            return res.json({
                errLog: constant.errLog.AlreadyExists
            })
        }else{
            arr.push(insert);
        }
    }
}