/**
 * Created by Tink on 2015/9/23.
 */

'use strict';

angular.module('app').factory('publishService', function($http){
    return {
        publishPost: function(data){
            return $http.post('/post', data);
        },
        publishComment: function(data){
            return $http.post('/comment', data);
        },
        upPost: function(data){
            return $http.post('/post/up', data);
        },
        unUpPost: function(data){
            return $http.delete('/post/up?username=' + data.username + '&postId=' + data.postId + '&uper=' + data.uper);
        }
    }
});