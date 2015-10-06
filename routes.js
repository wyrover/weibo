/**
 * Created by Tink on 2015/9/19.
 */

var user = require('./controllers/user');
var role = require('./controllers/role');
var permission = require('./controllers/permission');
var post = require('./controllers/post');
var comment = require('./controllers/comment');
var feeds = require('./controllers/feeds');
var interaction = require('./controllers/interaction');
var validation = require('./controllers/validation');



module.exports = function(app){

    /*  /
     -------------------------------------*/
    app.get('/', function(req, res, next){
        res.render('index.html')
    });

    /*  /sign
     -------------------------------------*/
    app.get('/sign', user.signIn); // sign in
    app.post('/sign', user.signUp); // sign up

    /*  /user
     -------------------------------------*/
    //app.get('/user', user.getBaseInfo); // get user_base_info
    //app.put('/user', user.updateBaseInfo); // update user_base_info
    //app.delete('/user');
    //
    ///*  /users
    // -------------------------------------*/
    //app.get('/users'); // list users
    //

    /*  /user/{{prop}}
     -------------------------------------*/
    app.get('/user/feeds', feeds.pull); // get ones timeline

    app.post('/post', post.publish); // add a post/repost for sb
    //app.delete('/post'); // delete a post/repost for sb
    //app.get('/posts'); // get all the posts of sb, when u interview ones home page or admin querys them
    //app.post('/post/up', post.up); // up ones post
    //app.delete('/post/up', post.unUp); // unUp ones post

    app.post('/comment', comment.publish); // add a comment in a  ones post
    //app.delete('/comment'); // delete a comment in a ones post
    //app.get('/comments'); // get all the comments of a post
    //app.post('/comment/up'); // up a comment
    //app.delete('comment/up'); // unUp a comment
    //
    //app.post('/notification'); // add a notification to sb
    //app.delete('/notification'); // delete a notification
    //app.put('/notification/status'); // turn a notification to other status
    //
    //app.post('/following', interaction.follow); // follow sb
    //app.delete('/following', interaction.unFollow); // unfollow sb
    //
    //app.delete('/follower'); // delete a fan


    /*  /role
     -------------------------------------*/
    //app.get('/role'); // get role and its permissions info
    app.post('/role', role.create); // create a new role type
    app.put('/role', role.changeName); // update all permissions or type value
    app.delete('/role', role.delete);

    app.post('/role/permission', role.addPermission);
    app.delete('role/permission', role.deletePermission);

    /*  /roles
     -------------------------------------*/
    app.get('/roles', role.getAll);

    /*  /permission
     -------------------------------------*/
    app.post('/permission', permission.create); // add a permission
    app.delete('/permission', permission.delete); // delete a permission, also delete it in all roles' permissions

    /*  /permissions
     -------------------------------------*/
    app.get('/permissions', permission.getAll);

}