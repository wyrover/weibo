/**
 * Created by Tink on 2015/9/23.
 */

'use strict';

angular.module('app').factory('roleData', function($http){
    return {
        create: function(data){
            return $http.post('/role', data);
        },
    }
});