/**
 * Created by Tink on 2015/9/26.
 */

'use strict';

angular.module('app').factory('signService' ,function($http){
    return {
        signIn: function(data){
            if(data.email){
                return $http.get('/sign?email=' + data.email+ '&password=' + data.password);
            }else{
                return $http.get('/sign?username=' + data.username + '&password=' + data.password);
            }
        },

        signUp: function(data){
            return $http.post('/sign',data);
        }


    }
});