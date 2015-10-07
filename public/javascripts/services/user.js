/**
 * Created by Tink on 2015/9/20.
 */

'use strict';

angular.module('app').factory('userService' ,function($http, $localStorage){
    return {

        syncLocalUserInfo: function(username){
            $http.get('/user?username='+username).success(function(res){
                if(res.data){
                    $localStorage.user = res.data;
                }
            })
        },

        getBaseInfo: function(data){
            return $http.get('/user?username=' + data.username);
        },
        updateBaseInfo: function(data){
            return $http.put('/user?username=' + data.username + '&newUser=' + data.newUser);
        },
        pullFeeds: function(data){
            return $http.get('/user/feeds?username=' + data);
        },
    }
});

