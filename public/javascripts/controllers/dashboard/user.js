/**
 * Created by Tink on 2015/10/9.
 */

angular.module('app').controller('userAdminCtrl', function($scope, $state, userService, weiboUtils, constant){

    /*              models
     -------------------------------------*/
    $scope.currentUser = {

    };

    $scope.currentUserPosts = [];

    $scope.searchInput = {
        username: ''
    };

    //---flags
    $scope.searchState = '';


    /*              methods
     -------------------------------------*/
    $scope.searchUser = function(){
        userService.getBaseInfo($scope.searchInput).success(function(res){
            if(res.hasOwnProperty('data')){
                $scope.currentUser = res.data;
                $scope.searchState = 'found';
                $scope.currentUserPosts = $scope.getUserPosts($scope.currentUser.name);
                $state.go('um-hasUser');
            }else{
                $scope.searchState = 'notFound';
            }
        })


    }

    //userService.getBaseInfo({username: 'honeycomb'}).success(function(res){
    //    $scope.currentUser = res.data;
    //});

    $scope.getUserPosts = function(userName){
        userService.getPosts(userName).success(function(res){
            $scope.currentUserPosts = res.data;
            console.log(res)
        })
    }



    $scope.deletePost = function(postId){
        var reqData = {
            username: $scope.currentUser.name,
            postId: postId
        }
        userService.deletePost(reqData).success(function(res){
            $scope.currentUserPosts = $scope.getUserPosts($scope.currentUser.name);
        })
    }


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