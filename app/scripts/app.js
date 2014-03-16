'use strict';

angular.module('webApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngRoute',

  // 3rd party dependencies
  'btford.socket-io',
  'nvd3ChartDirectives'
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
  }).directive('smootieChart', [function(){
      return {
        restrict: 'A',
        scope: {
          // Bindings
          data: '=',
        },
        link: function(scope, element, attrs){
          // Scope vars
          var data;
          var canvas = element[0];
          // Check Scope
          if (angular.isDefined(scope.data)) {
            data = scope.data;
          }
          
          var smoothie = new SmoothieChart({
            minValue: 0
          });
          smoothie.streamTo(canvas, 200);
          if (data instanceof Array){
            data.forEach(function(entry){
              smoothie.addTimeSeries(entry);
            });
          }else{
            smoothie.addTimeSeries(data);
          }
        }
      }; 
  }]);