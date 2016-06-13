'use strict';

var app = angular.module('gulpPractice',['ui.router']);

app.config(function ($stateProvider, $urlRouterProvider,$locationProvider) {
    $stateProvider
        .state('main',{
            url : '/main',
            templateUrl : 'views/main/main.html',
            controller: 'mainCtrl'
        })
        .state('login',{
            url : '/login',
            templateUrl : 'views/login/login.html',
            controller: 'logCtrl'
        })
        .state('404page',{
            url : '/404page',
            templateUrl : 'views/404page.html'
        });
    $urlRouterProvider.otherwise('/main');
    //$locationProvider.html5Mode(true);
} );