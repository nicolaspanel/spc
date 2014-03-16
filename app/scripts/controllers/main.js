'use strict';

angular.module('webApp')
  .controller('MainCtrl', function ($scope, $http, socket) {
    $scope.model = {};
    $scope.model.year = new Date().getFullYear();

    $scope.isLoading = true;

    $http.get('/api/state').success(function(data) {
      $scope.model.state = data.state;
      $scope.model.availableActions = data.actions;
      $scope.model.isLoading = false;
    });
    
    
    $scope.executeAction = function(action){
      $scope.model.isLoading = true;
      $http.get('/api/execute?action=' + action).success(function(data) {
        
      });
    };

    socket.on('state-changed', function(data) {
      $scope.model.state = data.state;
      $scope.model.availableActions = data.actions;
      $scope.model.isLoading = false;
    });
  });
