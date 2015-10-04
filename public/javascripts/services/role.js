/**
 * Created by Tink on 2015/9/23.
 */

'use strict';

angular.module('app').factory('roleData', function($http){
    return {
        create: function(data){
            return $http.post('/role', data);
        },
        changeName: function(data){
            return $http.put('/role?roleType=' + data.roleType + '&newType=' + data.newType);
        },
        delete: function(data){
            return $http.delete('/role?roleType=' + data.roleType);
        },
        getAll: function(){
            return $http.get('/roles');
        },
        addPermission: function(data){
            return $http.post('/role/permission', data);
        },
        deletePermission: function(data){
            return $http.delete('/role/permission');
        }
    }
});

angular.module('app').factory('permissionData', function($http){
    return {
        create: function(data){
            return $http.post('/permission', data);
        },
        delete: function(data){
            return $http.delete('/permission?resource=' + data.resource + '&action=' + data.action)
        },
        getAll: function(){
            return $http.get('/permissions');
        }

    }
});