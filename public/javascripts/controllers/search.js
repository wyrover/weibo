/**
 * Created by Tink on 2015/9/20.
 */


angular.module('app').controller('searchCtrl', function(
    $scope,
    $localStorage,
    $state,
    userService,
    foService){
    /*              models
     -------------------------------------*/
    $scope.searchingInput = '';
    $scope.searchedResult = '';
    $scope.searchedUser = {};

    /*              methods
     -------------------------------------*/
    $scope.search = function(){
        var reqData = {
            username: $scope.searchingInput
        }
        userService.getBaseInfo(reqData).success(function(res){
            if(typeof res.data == 'undefined'){
                $scope.searchedResult = 'notFound';
            }else{
                $scope.searchedUser = res.data;
                $scope.searchedResult = 'found';
            }
        });
    };


    //-----fo & unfo
    $scope.follow = function(followingName){
        var reqData = {
            username : $localStorage.user.name,
            followingName : followingName
        }
        foService.follow(reqData).success(function(res){
            userService.syncLocalUserInfo($localStorage.user.name);
        });
    }

    $scope.unFollow = function(followingName){
        var reqData = {
            username : $localStorage.user.name,
            followingName : followingName
        }
        foService.unfollow(reqData).success(function(res){
            userService.syncLocalUserInfo($localStorage.user.name);
        })
    }


    // show
    $scope.showComments = function(postId){
        for(var i = 0; i < $scope.postsShowing.length; i++){
            if($scope.postsShowing[i] == postId){
                return true;
            }
        }
        return false;
    }

    $scope.showFollowButton = function(username){
        if(username == $localStorage.user.name){
            return false;
        }

        if($localStorage.user.followings.some(function(f){
                return f == username
            })
        ){
            return false;
        }
        return true;

        //return username != 'honeycomb';
    }

    $scope.showUnFollowButton = function(username){
        if(username == $localStorage.user.name){
            return false;
        }
        if($localStorage.user.followings.some(function(f){
                return f == username
            })
        ){
            return true;
        }
        return false;

    }

    $scope.showRepostModal = function(){
        ngDialog.open({
            template: 'templateId',
            //className: 'ngDialog-theme-plain'
        })
    }

});