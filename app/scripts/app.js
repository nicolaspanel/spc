'use strict';

angular.module('webApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngRoute',

  // 3rd party dependencies
  'btford.socket-io'
])
  .config(function ($routeProvider, $locationProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'partials/main',
        controller: 'MainCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
      
    $locationProvider.html5Mode(true);
  })
  .filter('capitalize', function() {
    return function(input, scope) {
      return input.substring(0,1).toUpperCase()+input.substring(1);
    };
  }).factory('socket', function (socketFactory) {
    return socketFactory();
  });