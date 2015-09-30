/**
 * Created by Tink on 2015/9/19.
 */

var user = require('./controllers/user');
var role = require('./controllers/role');
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

    app.get('/sign', validation.usernameIsNull, validation.passwordIsNull, user.signIn); // sign in
    app.post('/sign', validation.usernameIsNull, validation.passwordIsNull, validation.emailIsNull, user.signUp); // sign up

    /*  /user
     -------------------------------------*/
    app.get('/user', user.getBaseInfo); // get user_base_info
    app.put('/user', user.updateBaseInfo); // update user_base_info
    app.delete('/user');

    /*  /users
     -------------------------------------*/
    app.get('/users'); // list users

    /*  /user/{{prop}}
     -------------------------------------*/
    app.get('/feeds', feeds.pull); // get ones timeline

    app.post('/post', post.publish); // add a post/repost for sb
    app.delete('/post'); // delete a post/repost for sb
    app.get('/posts'); // get all the posts of sb, when u interview ones home page or admin querys them
    app.post('/post/up', post.up); // up ones post
    app.delete('/post/up', post.unUp); // unUp ones post

    app.post('/comment', comment.publish); // add a comment in a  ones post
    app.delete('/comment'); // delete a comment in a ones post
    app.get('/comments'); // get all the comments of a post
    app.post('/comment/up'); // up a comment
    app.delete('comment/up'); // unUp a comment

    app.post('/notification'); // add a notification to sb
    app.delete('/notification'); // delete a notification
    app.put('/notification/status'); // turn a notification to other status

    app.post('/following', interaction.follow); // follow sb
    app.delete('/following', interaction.unFollow); // unfollow sb

    app.delete('/follower'); // delete a fan

    app.get('/role'); // get role and its permissions info
    app.post('/role', role.create); // create a new role type
    app.put('/role'); // update all permissions or type value

    app.post('/permission'); // add a permission to a role
    app.put('/permission'); // update a permission of a role
    app.delete('/permission'); // delete a permission of a role

    app.delete('/permissions'); // delete all the permissions of a role

}