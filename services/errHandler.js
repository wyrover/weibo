/**
 * Created by Tink on 2015/9/30.
 */

var constant = require('../constant');

module.exports = {
    handleDbErr: function(res){
        return res.json({
            errLog: constant.errLog.DbErr
        })
    },
    handleNotFound: function(doc){
        if(!doc){
            return res.json({
                errLog: constant.errLog.DbNotFound
            });
        }
    }
}