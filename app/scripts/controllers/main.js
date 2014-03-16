'use strict';

angular.module('webApp')
  .controller('MainCtrl', function ($scope, $http, socket) {
    $scope.model = {};
    $scope.model.year = new Date().getFullYear();
    
    $scope.xAxisTickFormatFunction = function(){
      return function(d){
        return d3.time.format('%x')(new Date(d)); //uncomment for date format
      };
    };

    $scope.model.exampleData = [{
      key: 'Position',
      values: [[0, 50], [1, 45]]
    },{
      key: 'Speed',
      values: []
    },{
      key: 'Voltage',
      values: []
    }];

    var updateState = function(data) {
      $scope.model.state = data.state;
      $scope.model.availableActions = data.actions;
      $scope.model.isLoading = false;
    };
    var updateRobotState = function(data) {
      $scope.model.position = data.position * 1000;
    };
    $scope.isLoading = true;

    $http.get('/api/state').success(function(data) {
      updateState(data);
    });
    $http.get('/api/robot-state').success(function(data) {
      updateRobotState(data);
    });
    
    $scope.executeAction = function(action){
      $scope.model.isLoading = true;
      $http.get('/api/execute?action=' + action).success(function(data) {
        
      });
    };

    socket.on('state-changed', function(data) {
      updateState(data);
    });
    socket.on('robot-state-changed', function(data) {
      updateRobotState(data);
    });
  });
