/**
 * Created by Tink on 2015/9/19.
 */

module.exports = {
    parseProp: function(req, prop){
        return req.body[prop] || req.query[prop] || req.params[prop];
    }
}

