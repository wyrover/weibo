/**
 * Created by Tink on 2015/10/9.
 */

angular.module('app').controller('userAdminCtrl', function($scope, userService, weiboUtils, constant){

    /*              models
     -------------------------------------*/
    $scope.currentUser = {

    };

    $scope.searchInput = {
        username: ''
    };


    /*              methods
     -------------------------------------*/
    $scope.searchUser = function(){
        userService.getBaseInfo($scope.searchInput).success(function(res){
            if(res.hasOwnProperty('data')){

            }
        })


    }

    userService.getBaseInfo({username: 'honeycomb'}).success(function(res){
        $scope.currentUser = res.data;
    });

})