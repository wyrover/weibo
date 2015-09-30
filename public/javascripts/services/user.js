/**
 * Created by Tink on 2015/9/20.
 */

'use strict';

angular.module('app').factory('userData' ,function($http){
    return {
        getBaseInfo: function(data){
            return $http.get('/user?username=' + data.username);
        },

        updateBaseInfo: function(data){
            return $http.put('/user?username=' + data.username + '&newUser=' + data.newUser);
        },

        test: function(data){
            return $http.post('/todo', data);
        }
    }
});