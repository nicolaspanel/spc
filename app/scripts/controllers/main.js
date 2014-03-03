'use strict';

angular.module('webApp')
  .controller('MainCtrl', function ($scope, $http, socket) {
    
    $scope.year = new Date().getFullYear();

    $scope.isLoading = true;

    $http.get('/api/state').success(function(data) {
      $scope.state = data.state;
      $scope.availableActions = data.actions;
      $scope.isLoading = false;
    });
    
    
    $scope.executeAction = function(action){
      $scope.isLoading = true;
      $http.get('/api/execute?action=' + action).success(function(data) {
        
      });
    };

    socket.on('state-changed', function(data) {
      $scope.state = data.state;
      $scope.availableActions = data.actions;
      $scope.isLoading = false;
    });
  });
