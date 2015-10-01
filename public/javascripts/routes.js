/**
 * Created by Tink on 2015/9/20.
 */

'use strict';

angular.module('app').config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider){
    $urlRouterProvider
        //.when('/')
        //.when('/')
        .otherwise('');
    $stateProvider
        // *    root
        // ---------------------
        .state('root', {
            url: '',
            template: '<ui-view/>',
            // config a ng-ctrl to manage all init-method

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
        .state('nav-bannerStyle-outLogged', {
            parent: 'root',
            templateUrl: 'views/nav.bannerStyle.outLogged.html'
        })
        // *    index home page
        // ---------------------
        .state('home', {
            url: '/home',
            parent: 'nav-bannerStyle',
            templateUrl: 'views/home.html',
            data: {
                css: [
                    'bower_components/font-awesome/css/font-awesome.min.css',
                    'stylesheets/footer.css',
                    'stylesheets/banner.css',
                    'stylesheets/profile.css',
                    //'stylesheets/ct-paper.css',
                    'stylesheets/bootstrap.min.css',]
            }
        })
        .state('profile', {
            url: '/profile',
            parent: 'nav-bannerStyle',
            templateUrl: 'views/profile.html',
            data: {
                css: [
                    'bower_components/font-awesome/css/font-awesome.min.css',
                    'stylesheets/footer.css',
                    'stylesheets/banner.css',
                    'stylesheets/profile.css',
                    'stylesheets/mypage.css',
                    //'stylesheets/ct-paper.css',
                    'stylesheets/bootstrap.min.css',]
            }
        })
        /*
         / ---------------------*/
        .state('sign', {
            parent: 'root',
            templateUrl: 'views/sign.html'
        })
        .state('signIn', {
            url: '/signIn',
            parent: 'sign',
            templateUrl: 'views/signIn.html'
        })
        .state('signUp', {
            url: '/signUp',
            parent: 'sign',
            templateUrl: 'views/signUp.html'
        })
        //.state('signing', {
        //    parent: 'sign',
        //    template: ''
        //})

        .state('test', {
            url: '/test',
            parenr: 'root',
            templateUrl: 'views/test.html',
            data: {
                css: 'stylesheets/theme.css'
            }
        })
        .state('admin', {
            url: '/admin',
            parent: 'sign',
            templateUrl: 'views/role.html'
        });


}])