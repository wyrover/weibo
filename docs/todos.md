title： 项目中需要优化的部分
> 暂时只关注功能
# 引入新的组件
* 图片上传组件
  * ng-flow
* 消息通知组件
  * notie.js

# 补完计划
* 用户信息设置页
* 用户主页
* 搜索页

# 用户登录注册
* 对输入信息要做验证
  * 并在停止输入时（鼠标光标离开输入框的时候）就进行检查和报错
  * 后端再做一次验证
* 添加一些注册成功的消息框
* 登录或注册出错的时候， 后台有逻辑问题
  * 要么在面试时掩盖掉， 要么留到后面有时间对后端做一次重构

# 首页
* url问题
  * 去掉`#`
* 退出登录
* 设置
* 点击名片上的数字， 都可以切到详情页
* 发布框的边框显隐问题
* >点击“weibo”应该可以返回首页

## 动态编辑互动模块
* 不能发布空微博
* 可以删除自己的微博
* 可以发图片
  * 同时也要处理图片的展示
* 对发布内容做一定的验证，如字数限制， 图片上传错误等
* 发布成功， 要有提示
>* 时间的显示有问题
* 对动态要有分页处理
* 对于评论列表， 新发评论应该处于最上面

## 用户互动
### 搜索用户
* 该模块要整个地重写， 只要展示同名的人和简单信息就好了， 还要提供一个关注/取关按钮
* 最好能实现模糊搜索
### 用户主页
* 有时间就写下
### 点击头像要可以名片悬浮
* 可以关注
* 显示用户名、签名、粉丝和微博数
### 移除粉丝

# 管理员界面
* 界面调整
* 管理员登录
## 角色
* 如果一次新建了多个新角色， 对他们进行点击“修改”时， 它们都会跳出下拉输入框，并且共享数据
* 点击修改角色名无效（不是无效， 是没有在前端同步更新新的角色名， 这时选择删除， 还会报错删除失败）
* 为角色添加新权限失败

## 用户管理
* 要可以对用户的信息修改
* 展示用户的粉丝和关注者
* 实现删除用户微博的功能