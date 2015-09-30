/**
 * Created by Tink on 2015/9/22.
 */

'use strict';

angular.module('app').factory('feedsData' ,function($http){



    return {
        pull: function(data){
            return $http.get('/feeds?username=' + data);
        },

    }
});