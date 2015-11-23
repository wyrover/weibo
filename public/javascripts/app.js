/**
 * Created by Tink on 2015/9/20.
 */

'use strict';

var app = angular.module('app', [
    'ngStorage',
    'ui.router',
    'uiRouterStyles',
    //'ui.bootstrap',
    '720kb.tooltips',
    'flow',
    'ngDialog',
    'angularMoment',
    //'yaru22.hovercard'
]);

app.run(['$rootScope', '$state', '$stateParams', function($rootScope, $state, $stateParams){
    //允许在整个应用的任何scope中获取到$state以及$stateParams服务中的数据
    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;
}]);



//http拦截器
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