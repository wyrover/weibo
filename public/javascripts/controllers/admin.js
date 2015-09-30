/**
 * Created by Tink on 2015/9/23.
 */


'use strict';

angular.module('app').controller('adminCtrl', function($scope, roleData){

    /*              models
     -------------------------------------*/
    $scope.role = {
        roleType : ''
    }


    /*              methods
     -------------------------------------*/
    $scope.createRole = function(){
        roleData.create($scope.role).success(function(res){
            console.log(res);
        });
    }


});