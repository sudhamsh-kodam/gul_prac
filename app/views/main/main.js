'use strict';

var app = angular.module('gulpPractice',['ui-router']);

app.controller('mainCtrl', ['$scope'],function ($scope) {
    $scope.test = 'test .....'
});
