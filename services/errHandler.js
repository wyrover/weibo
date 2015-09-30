/**
 * Created by Tink on 2015/9/30.
 */

var constant = require('../constant');

module.exports = {
    handleNotFound: function(doc){
        if(!doc){
            return res.json({
                errLog: constant.errLog.DbNotFound
            });
        }
    }
}