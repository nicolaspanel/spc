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
          // attributes
          min: '@',
          max: '@'
        },
        link: function(scope, element, attrs){
          // Scope vars
          var data;
          scope.canvas = element[0];
          scope.container = angular.element(scope.canvas).parent();
          scope.canvas.width = scope.container.width();
          var options = {};
          scope.counter = 0;
          setInterval(function(){
            scope.counter++;
          },200);
          scope.$watch('counter', function(newValue, oldValue){
              scope.canvas.width = scope.container.width();
            }, true);
          // scope.$watch('container', function(newValue, oldValue) {
          //   //console.log(newValue);
          // }, true);
          // Check attributes
          if (angular.isDefined(attrs.min)) {
            options.minValue = attrs.min;
          }
          if (angular.isDefined(attrs.max)) {
            options.maxValue = attrs.max;
          }

          // Check Scope
          if (angular.isDefined(scope.data)) {
            data = scope.data;
          }
          
          var smoothie = new SmoothieChart(options);
          smoothie.streamTo(scope.canvas, 200);
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