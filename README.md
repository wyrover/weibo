# weibo

This is a simple demo app like weibo(a twitter like web app) with angularJs as font-end and express as back-end.

这是一个简单的仿微博应用, 实践了一把MEAN开发, 即数据库用MongoDB, 服务器端框架用Express, 前端MVVM用AngularJs, 这一切都基于NodeJs.

![2015-12-16_11-29-33.gif](https://ooo.0o0.ooo/2015/12/15/5670db3ed1a8a.gif)

#  Node & Express
> 这个repo的服务器端, 由于当初演示的需要, 所以即使发现到有实现得不好的地方, 依旧保持了原样. 而经过思考后重构的代码, 请看这个repo:  [**think-todo**](https://github.com/TinkGu/think-todo)

后端分成三层, 分别为model、service、controller. app.js是入口文件, routes.js控制路由分发.

// routes.js

```
module.exports = function(app){

  /*  /
  -------------------------------------*/
  app.get('/', function(req, res, next){
    res.render('index.html')
  });

  /*  /sign
  -------------------------------------*/
  app.get('/sign', user.signIn);  // sign in
  app.post('/sign', user.signUp); // sign up

  // ....
}
```

## 使用mongoose进行数据持久化

每个model都继承Mongoose Schema类型, 再通过model/index.js来完成数据库连接, 统一导出为Mongoose Model类型.

// model/user.js
```
exports.User = new Schema({
  name            : String,
  password        : String,
  email           : String, // non-undefined
  //...
});
```
// model/index.js
```
mongoose.connect(config.dbConnectionString); // mongo db connection
var db = mongoose.connection;

module.exports = {
   user            : mongoose.model('user', require('./user').user),
   role            : mongoose.model('role', require('./user').role),
   //...
 }
```

## service层封装了常用的增删改查, 让controller层专注业务.

为了处理回调地狱(callback hell)的问题, 最终采用了async/await. 当然并非直接使用ES6语法, 而是通过一个名为asyncawait的第三方模块作为腻子, 不过发现还是要开 --harmony 模式才能正常启动, 所以预计未来会直接换掉.

由于对promise的不够深入, 在错误处理方面, 还存在问题. 相对较好的解决方案放在了另一个repo: [**think-todo**](https://github.com/TinkGu/think-todo)中.


拿think-todo的代码来说

// controller/user.js
```
exports.signIn = async(function(req, res, next){
    var name = req.query.name;
    var pass = req.query.pass;

    try{
        var user = await(UserService.getOneExisted({name: name, pass: pass}, res));
    }catch(err){
        console.log(err.stack);
        return;
    }

    var userObj = user.toObject();
    delete userObj.pass;

    return res.json({
        user: 'userObj'
    });
});
```
将异步写成同步的格式, 并能够良好地抛出异常.

// service/user.js
```
var getOne = async(function(condition, res){
    try{
        return await(User.findOne(condition).exec());
    }catch(err){
        res.status(500).end();
        throw err;
    }
});
```

## 使用jwt代替cookie/session来解决身份验证

依赖自jsonwebtoken模块, 每次登陆, 就在响应中写入一个token, 保存到客户端的localStorage中. 以后通过解析请求中的token来确认用户的身份.

// conntroller/user.js/signIn()
```
result.token = jwt.sign(result, config.tokenSecret, {expiresInMinutes: config.tokenExpires});
```
登陆成功后, 将token保存到浏览器的localStorage中. 在客户端开启拦截器, 每次请求都附带当前用户信息.
```
app.config(function($httpProvider){
  $httpProvider.interceptors.push(function($localStorage){
    return{
      'request': function(config){
        config.headers = config.headers || {};
        if($localStorage.token){
          config.headers.Authorization = '' + $localStorage.token;//todo 去掉了Bearer化
        }
        return config;
      },
      //'responseError'
    }
  });
});
```

# Angular & 前端页面组织方式
前端js代码的组织架构和后端的思想有点相似, 基于AngularJS的思想, 自然地分成两层, service和controller, app.js作为入口文件, routes.js分发路由.

## service & controller
前端的service和controller并不是后端人为的分层, 而是ng的规范, 据说搞ng的是java出身的, 通过`controller()`方法和`factory()`方法, 封装控制器和服务.

实现service以后可以像一个ng模块一样依赖注入到其它controller中.

// public/javascripts/services/user.js
```
angular.module('app').factory('userService' ,function($http, $localStorage){
    return {

        syncLocalUserInfo: function(username){
            $http.get('/user?username='+username).success(function(res){
                if(res.data){
                    $localStorage.user = res.data;
                }
            })
        },

        getBaseInfo: function(data){
            return $http.get('/user?username=' + data.username);
        },
        updateBaseInfo: function(data){
            return $http.put('/user?username=' + data.username + '&newUser=' + data.newUser);
        }
    }
});
```
和后端开发的思路一致, services层将请求操作封装起来, 供多个controllers调用.

// public/javascripts/controllers/user.js
```
angular.module('app').controller('userCtrl', function(
    $scope, $localStorage, $state, ngDialog, userService, publishService, foService){
    /*              models
     -------------------------------------*/
    var page = 0;
    $scope.totalFeeds = [];
    $scope.feedBox = [];
    $scope.feeds = [];

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
    }

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
    //...
});
```

// public/views/home.html
```
<div class="container" ng-controller="userCtrl">

...

<li ng-repeat="feed in feeds">

...

<span ng-repeat="parent in feed.parents">//@<a>{{parent.author}}</a>:{{parent.content}}</span>
```
在html中, 通过`ng-controller`属性来绑定同名的controller. 以`{{模版变量}}`的语法, 将该controller.scope中的model数据渲染到视图中.

ng-repeat和ng-if等都是方便的指令, 可以对dom元素进行显隐控制, 循环遍历渲染等等...

## ui.router & uiRouterStyles
ui.router是一个非官方的第三方ng模块, 它基于状态(`state`)来对应路由变化切换视图. 每一个state都可以配置一条url, 一个模版文件, 模版文件将会渲染到最近的一个`<div ui-view>`上. 前端便可以通过状态变化来动态地跳转页面.

通过这种方式, 前端html/css文件变得相当细碎, 但是更模块化, 不同文件间的依赖关系一目了然, 便于管理.

// public/javascripts/routes.js
```
.state('root', {
  url: '',
  template: '<ui-view/>', // config a ng-ctrl to manage all init-method
  })
  // *    root.nav
  // ---------------------
  .state('nav-barStyle', {
    parent: 'root',
    templateUrl: 'views/nav.barStyle.html'
  })
  .state('nav-bannerStyle', {
    parent: 'root',
    templateUrl: 'views/nav.bannerStyle.html'
  })
  .state('home', {
    url: '/home',
    parent: 'nav-bannerStyle',
    templateUrl: 'views/home.html',
    data: {
      css: [
        'bower_components/ng-dialog/css/ngDialog-theme-plain.css',
        'stylesheets/bootstrap.min.css',
      ]
    }
  })
  // ...
```
// public/views/index.html
```
<body>

<div ui-view></div>

</body>
```
// public/views/nav.bannerStyle.html
```
<nav class="navbar navbar-default navbar-fixed-top topnav" role="navigation">
  <!-- nav containers -->
</nav>

<ui-view/>  // render home.html later
```
当访问`xxx.com/#/home`的时候, 就会对应地将应用的路由状态切换至`home`. 默认会加载它的父路由, 即`nav-barStyle`以及祖父路由`root`.

加载路由的同时, 会将该`state`下的视图模版(.html)渲染到最近一次的`<ui-view>`所在的位置, 看起来, 整个视图都被刷新了.

还可以为这个state配置controller, 规定一旦转入该状态, 就立即触发.

ui.router并不支持动态地加载css, 通过另一个第三方ng模块uiRouterStyles, 可以实现根据路由规则, 加载不同的css. 但需要注意, 它是从下往上加载css的, 对应上述代码中的css这个数组, 就是从数组的最后一个元素(最后一个css文件)开始加载, 所以如果css之间有依赖或覆盖规则的话, 顺序就很重要. 这算是我掉坑后小小的一个体会.

ui.router也支持手动切换state, 通过`$state.go('state name');`可以马上跳转到指定状态.

## bower包管理
bower相当好用, 本项目中仅仅作为包下载和版本管理, 使用得比较粗暴, 没有做打包、压缩、丑化, 直接从bower_components文件中引min.js到index.html中, 使得index.html尾部挂了长长的一大串`<script>`标签.

随着bower项目宣告死亡, 下一步准备弃用bower, 拥抱**npm + webpack**. 事实上我已经在think-todo中试用了webpack, 用npm下载安装前端模块, 并通过webpack打包为一个文件, 更加工程化.

bower可以通过.bowerrc文件设置其bower_components文件夹的地址
// .bowerrc
```
{
  "directory": "public/bower_components"
}
```

其它用过的包

* momentjs

处理日期格式

* ng-dialog

弹出框

* notie

顶部消息提示条

# 测试
这个项目并没有添加测试, 未来重写的同时将会补充测试代码. 关于测试的实践已经在think-todo中给出, 目前只对后端有过测试.

mocha作为基本的测试框架, should作为断言库, supertest模拟HTTP请求, 检测返回的响应的HTTP状态码和某些JSON对象, cli下键入命令查看测试结果返回去修改bug, 查看实现程度.
```
describe('test/controllers/user.test.scripts', function(){
    describe('#signUp', function(){
        it('should post /sign 200', function(done){
            request.post('/sign')
                .send({
                    name: 'test123',
                    pass: '123',
                    email: 'testmail123'
                })
                .end(function(err, res){
                    res.status.should.equal(200);
                    done(err);
                });
        });
        it('should reject user that his name has existed', function(done){
            request.post('/sign')
                .send({
                    name: 'weibo',
                    pass: '123',
                    email: 'email'
                })
                .expect(403, function(err, res){
                    res.text.should.containEql('already existed');
                    done(err);
                });
        });
        it('should reject user that his email has existed', function(done){
            request.post('/sign')
                .send({
                    name: 'name',
                    pass: '123',
                    email: 'testmail123'
                })
                .expect(403, function(err, res){
                    res.text.should.containEql('already existed');
                    done(err);
                });
        });
    });
});
```
未来还将尝试持续集成, 提交前自动测试, 尽量实现自动化测试.

# Todo
* 图片上传
* 后端分页, 优化取微博数据的部分

目前是返回了用户关注的所有用户的所有微博, 这显然是不科学的.

* 更新返回的HTTP状态码

后端代码对返回响应并没有特意设置其HTTP状态码, 合理设置HTTP状态码有助于测试和调试

* 将复杂组件封装为directives


# ChangeLog
* 标签语义化
