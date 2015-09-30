/**
 * Created by Tink on 2015/9/26.
 */

'use strict';

angular.module('app').factory('signService' ,function($http){
    return {
        signIn: function(data){
            return $http.get('/sign?username=' + data.username + '&password=' + data.password + '&email=' + data.email);
        },

        signUp: function(data){
            return $http.post('/sign',data);
        },


    }
});