/**
 * Created by Tink on 2015/10/9.
 */

angular.module('app').controller('userAdminCtrl', function($scope, $state, userService, weiboUtils, constant){

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
                $scope.currentUser = res.data;
            }else{

            }
        })


    }

    userService.getBaseInfo({username: 'honeycomb'}).success(function(res){
        $scope.currentUser = res.data;
    });


    /*              auto
     -------------------------------------*/
    $scope.showDetails = function(){
        if(typeof $scope.currentUser.name == 'undefined'){
            $state.go('um-nullUser');
        }else{
            $state.go('um-hasUser');
        }
    }();



})