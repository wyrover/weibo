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
    var page = 0;
    $scope.totalFeeds = [];
    $scope.feedBox = [];
    $scope.feeds = [];

    //todo 如果有空的话改一下这个名字, 不仅仅存放了showing的postId, commentId也放进来了.
    $scope.postsShowing = [];
    $scope.contents = {
        mainPost: '',
    };
    $scope.currentUser = $localStorage.user;

    /*              methods
     -------------------------------------*/

    // -------redirect----
    $scope.visitHomePage = function(username){
        //userService.getBaseInfo(username)
    }


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
        //userService.pullFeeds($localStorage.user.name).success(function(res){
        //    $scope.totalFeeds = res.data.sort(function(a, b){
        //        if(Date.parse(a.post.createDate) >= Date.parse(b.post.createDate)){
        //            return -1;
        //        }
        //        else{
        //            return 1;
        //        }
        //    });
        //
        //});
    }

    //$scope.$watch('totalFeeds', function(o, n){
    //    if(o !== n){
    //        console.log($scope.flag);
    //        console.log("changed");
    //
    //        var temp = $scope.totalFeeds.slice();
    //        console.log(temp);
    //        while(temp.length > 20){
    //            var arr = temp.splice(0, 20); // 截取20个元素
    //            $scope.feedBox.push(arr);
    //        }
    //        if(temp.length > 0){
    //            $scope.feedBox.push(temp);
    //            $scope.feeds = $scope.feedBox[0];
    //        }
    //    }
    //})

    // $localStorage.user.name

    var getFeeds = function(name){
        userService.pullFeeds(name).success(function(res){
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

    //var parseFeeds = function(datas){
    //    var data = datas.slice();
    //    for(var i = 0; i < data.length -1; i++){
    //        for(var  j = 0; j < data.length - i -1; j++){
    //            if(data[j].post.createDate > data[j+1].post.createDate){
    //                var cache = data[j];
    //                data[j+1] = cache;
    //            }
    //        }
    //    }
    //    console.log("data", data);
    //    $scope.totalFeeds = data;
    //}
    //
    //var feedsHandler = function(){
    //    var temp = $scope.totalFeeds.slice();
    //    console.log(temp);
    //    while(temp.length > 20){
    //        var arr = temp.splice(0, 20); // 截取20个元素
    //        $scope.feedBox.push(arr);
    //    }
    //    if(temp.length > 0){
    //        $scope.feedBox.push(temp);
    //        $scope.feeds = $scope.feedBox[0];
    //    }
    //}

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

        if(!reqData.post.content){
            notie.alert(3, '请先输入内容', 1.5);
            return;
        }

        publishService.publishPost(reqData).success(function(res){
            $scope.contents.mainPost = '';
            $scope.pullFeeds();
            notie.alert(1, '发布成功', 1.5);
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

        if(!reqData.post.content){
            notie.alert(3, '请先输入内容', 1.5);
            return;
        }

        publishService.publishPost(reqData).success(function(res){
            delete $scope.contents[postId+'repost'];
            ngDialog.close(dialogId);
            notie.alert(1, '转发成功', 1.5);
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

        if(!reqData.comment.content){
            notie.alert(3, '请先输入内容', 1.5);
            return;
        }

        publishService.publishComment(reqData).success(function(res){
            console.log(res);
            delete $scope.contents[postId];
            $scope.pullFeeds();
            notie.alert(1, '评论成功', 1.5);
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

        if(!reqData.comment.content){
            notie.alert(3, '请先输入内容', 1.5);
            return;
        }

        publishService.publishComment(reqData).success(function(res){
            console.log(res);
            delete $scope.contents[comment._id];
            $scope.pullComments(comment._id);
            $scope.pullFeeds();
            notie.alert(1, '回复成功', 1.5);
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
        };
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
    };


    // show
    $scope.showComments = function(postId){
        for(var i = 0; i < $scope.postsShowing.length; i++){
            if($scope.postsShowing[i] == postId){
                return true;
            }
        }
        return false;
    };

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
    };

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

    };

    $scope.showRepostModal = function(){
        ngDialog.open({
            template: 'templateId',
            //className: 'ngDialog-theme-plain'
        })
    };

    /*              autos
     -------------------------------------*/
    $scope.pullFeeds();


    /*              listeners
     -------------------------------------*/
    $scope.$on('ngDialog.closed', function(err){
        $scope.pullFeeds();
    });

    $scope.$on('pullFeeds', function(){
        $scope.pullFeeds();
    });


});