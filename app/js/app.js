'use strict';

var app = angular.module('gulpPractice',[]);

app.config(routerConfig, function ($stateProvider, $urlRouterProvider) {
    $stateProvider
        .state('home',{
            url : '/',
            templateUrl : 'app/views/login.html',
            controller: 'mainCtrl'
        })
        .state('404page',{
            url : '/404page',
            templateUrl : 'app/views/404page.html'
    })
        .$urlRouterProvider.otherwise('/404page');
} );