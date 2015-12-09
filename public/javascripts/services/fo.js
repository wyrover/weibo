/**
 * Created by Tink on 2015/9/26.
 */

'use strict';

angular.module('app').factory('foService' ,function($http){
    return {
        follow: function(data){
            return $http.post('/following',data);
        },

        unfollow: function(data){
            return $http.delete('/following?username=' + data.username + '&followingName=' + data.followingName);
        }


    }
});
