'use strict';

angular.module('webApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngRoute'
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
    }
  });