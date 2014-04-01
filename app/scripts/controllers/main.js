'use strict';

angular.module('webApp')
  .controller('MainCtrl', function ($scope, $http, socket) {
    
    $scope.model = {};
    $scope.model.year = new Date().getFullYear();
    $scope.model.positionsSerie = new TimeSeries();
    $scope.model.target = 0;
    $scope.model.isTracking = false;
  
    // $scope.xAxisTickFormatFunction = function(){
    //   return function(d){
    //     return d3.time.format('%x')(new Date(d)); //uncomment for date format
    //   };
    // };

    var updateState = function(data) {
      $scope.model.state = data.state;
      $scope.model.availableActions = data.actions;
      $scope.model.isLoading = false;
      $scope.model.isTracking = data.state === 'Tracking';
    };
    var updateTarget = function(){
      $http.get('/api/updateTarget?target=' + $scope.model.target / 1000).success(function(data) { });
    };
    
    $scope.isLoading = true;

    $http.get('/api/state').success(function(data) {
      updateState(data);
    });
    $http.get('/api/robot-state').success(function(data) {
      $scope.model.position = data.position * 1000;
    });
    
    $scope.executeAction = function(action){
      $scope.model.isLoading = true;
      $http.get('/api/execute?action=' + action).success(function(data) {});
    };

    socket.on('state-changed', function(data) {
      updateState(data);
    });
    socket.on('robot-state-changed', function(data) {
      $scope.model.position = data.position * 1000;
      $scope.model.positionsSerie.append(data.datetime, data.position * 1000);
    });

    $scope.$watch('model.target', function(){
      updateTarget();
    });
  });
