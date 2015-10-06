/**
 * Created by Tink on 2015/9/20.
 */


angular.module('app').controller('userCtrl', function(
    $scope,
    $localStorage,
    $state,
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





    $scope.getBaseInfo = function(username){
        var reqData = {
            username: username
        }
        userService.getBaseInfo(reqData).success(function(res){
            $localStorage.user = res.data;
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

    $scope.repost = function(postId){
        //var reqData = {
        //    username: $localStorage.user.name,
        //    post: {
        //        author: $localStorage.user.name,
        //        content: $scope.contents,
        //    }
        //}
        console.log('repost')
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


    $scope.replyComment = function(postId, commentId){
        var reqData = {
            username: $localStorage.user.name,
            postId: postId,
            comment: {
                author: $localStorage.user.name,
                content: $scope.contents[commentId],
                parent: commentId
            }
        }

        publishService.publishComment(reqData).success(function(res){
            console.log(res);
            delete $scope.contents[commentId];
            $scope.pullFeeds();
        })
    }

    $scope.follow = function(followingName){
        var reqData = {
            username : $localStorage.user.name,
            followingName : followingName
        }
        foService.follow(reqData).success(function(res){
            $scope.getBaseInfo($localStorage.user.name);
        });
    }

    $scope.unFollow = function(followingName){
        var reqData = {
            username : $localStorage.user.name,
            followingName : followingName
        }
        foService.unfollow(reqData).success(function(res){
            console.log(res);
            $scope.getBaseInfo($localStorage.user.name);
        })
    }

    $scope.upPost = function(postId){
        var reqData = {
            username: $localStorage.user.name,
            postId: postId,
            uper: $localStorage.user.name
        }
        if($scope.feeds.some(function(feed){
               return feed._id == postId && feed.ups.some(function(u){console.log(u); return u == $localStorage.user.name;});
            })
        ){
            publishService.unUpPost(reqData).success(function(res){
                console.log(res);
                $scope.pullFeeds();
            })
        }else{
            publishService.upPost(reqData).success(function(res){
                $scope.pullFeeds();
            })
        }
    }

    $scope.showComments = function(postId){
        for(var i = 0; i < $scope.postsShowing.length; i++){
            if($scope.postsShowing[i] == postId){
                return true;
            }
        }
        return false;
        //return $scope.postsShowing.some(function(p){
        //        return p == postId
        //    });
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

    //$scope.hasSitePermission = function(subject, action){
    //    return authData.hasSitePermission(subject, action);
    //}

    /*              autos
     -------------------------------------*/
    $scope.pullFeeds();



    //test
    $scope.test = function(){
        var reqData = {
            participants: ["560a096a103725682664937a", "560a094d1037256826649379", "560a08f81037256826649377"],
            title: '吃早饭'
        }
        userService.test(reqData).success(function(err){

        });
    }

    //$scope.test();

});