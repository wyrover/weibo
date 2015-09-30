/**
 * Created by Tink on 2015/9/26.
 */

'use strict';

angular.module('app').controller('signCtrl', function(
    $scope,
    $localStorage,
    $state,
    signService){

    /*              models
     -------------------------------------*/
    //todo 在每次重新登录/注册之后, 都要把userInputs中的值清空(或者只清空密码)
    //todo 对于注册登录的validation, 前后台都要做; 输入前判断和查无此人/查重判断
    $scope.signInputs = {
        username: '',
        password: '',
        email: ''
    }


    /*              methods
     -------------------------------------*/

    $scope.signIn = function(){
        signService.signIn($scope.signInputs).success(function(res){
            //todo errHandler
            //todo when coding the logout function, delete local token
            console.log(res);
            //authData.changeSiteRoleAndPermissions(res.data.siteRole, res.data.sitePermissions);
            $localStorage.token = res.data.token;
            $localStorage.user = res.data;
            $state.go('home');
        });
    }

    $scope.signUp = function(){
        signService.signUp($scope.signInputs).success(function(res){
            //todo errHandler
            console.log(res.data);
            $state.go('signIn');
        });
    }

    $scope.signOut = function(){
        //clear localStorage
    }


});