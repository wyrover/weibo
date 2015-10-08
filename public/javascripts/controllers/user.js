/**
 * Created by Tink on 2015/9/20.
 */


angular.module('app').controller('userCtrl', function(
    $scope,
    $localStorage,
    $state,
    ngDialog,
    userService,
    publishService,
    foService){
    /*              models
     -------------------------------------*/
    $scope.feeds = [];

    //todo 如果有空的话改一下这个名字, 不仅仅存放了showing的postId, commentId也放进来了.
    $scope.postsShowing = [];
    $scope.contents = {
        mainPost: ''
    };

    /*              methods
     -------------------------------------*/

    //--------feeds-------
    $scope.pullFeeds = function(){
        userService.pullFeeds($localStorage.user.name).success(function(res){
            $scope.feeds = res.data.sort(function(a, b){
                if(Date.parse(a.post.createDate) >= Date.parse(b.post.createDate)){
                    return -1;
                }
                else{
                    return 1;
                }
            });
        });
    }

    $scope.updateBaseInfo = function(username, newUser){
        var reqData = {
            username: username,
            newUser: newUser
        }
        userService.updateBaseInfo(reqData).success(function(res){
            $localStorage.user = res.data;
        });
    }

    $scope.findUser = function(username){

    }


    //-------post
    $scope.publishPost = function(){
        var reqData = {
            username: $localStorage.user.name,
            post: {
                author: $localStorage.user.name,
                content: $scope.contents.mainPost,
            }
        }
        publishService.publishPost(reqData).success(function(res){
            $scope.contents.mainPost = '';
            $scope.pullFeeds();
            console.log(res.data);
        });
    }

    //todo 给转发设置弹出框
    $scope.repost = function(postId, dialogId){
        var reqData = {
            username: $localStorage.user.name,
            post: {
                author: $localStorage.user.name,
                content: $scope.contents[postId+'repost'],
                parent: postId
            }
        }

        publishService.publishPost(reqData).success(function(res){
            delete $scope.contents[postId+'repost'];
            ngDialog.close(dialogId);
        })
    }

    /*              methods/comments
     -------------------------------------*/
    $scope.pullComments = function(postId){
        console.log($scope.postsShowing);
        var shouldShow = true;
        var index;
        for(var i = 0; i < $scope.postsShowing.length; i++){
            if($scope.postsShowing[i] == postId){
                index = i;
                shouldShow = false;
            }
        }
        if(shouldShow){
            $scope.postsShowing.push(postId);
        }else{
            console.log(index)
            $scope.postsShowing.splice(index, 1);
        }
    }

    $scope.publishComment = function(postId){
        var reqData = {
            username: $localStorage.user.name,
            postId: postId,
            authorName: $localStorage.user.name,
            comment: {
                content: $scope.contents[postId],
                position: postId+(Date.now().toString())
            }
        }

        publishService.publishComment(reqData).success(function(res){
            console.log(res);
            delete $scope.contents[postId];
            $scope.pullFeeds();
        })
    }

    $scope.replyComment = function(postId, comment){
        var reqData = {
            username: $localStorage.user.name,
            postId: postId,
            authorName: $localStorage.user.name,
            parentComment: comment,
            comment: {
                content: $scope.contents[comment._id],
                position: postId+(Date.now().toString()),
                parent: comment._id
            }
        }

        publishService.publishComment(reqData).success(function(res){
            console.log(res);
            delete $scope.contents[comment._id];
            $scope.pullComments(comment._id);
            $scope.pullFeeds();
        })
    }


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


    //-------up & unup
    $scope.upPost = function(postId){
        var reqData = {
            username: $localStorage.user.name,
            postId: postId,
            uper: $localStorage.user.name
        }
        if($scope.feeds.some(function(feed){
               return feed.post._id == postId && feed.post.ups.some(function(u){return u == $localStorage.user.name;});
            })
        ){
            publishService.unUpPost(reqData).success(function(res){
                $scope.pullFeeds();
            })
        }else{
            publishService.upPost(reqData).success(function(res){
                $scope.pullFeeds();
            })
        }
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

    /*              autos
     -------------------------------------*/
    $scope.pullFeeds();


    /*              listeners
     -------------------------------------*/
    $scope.$on('ngDialog.closed', function(err){
        $scope.pullFeeds();
    })

});