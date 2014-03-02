'use strict';

angular.module('webApp')
  .controller('MainCtrl', function ($scope, $http) {
    
    $http.get('/api/state').success(function(res) {
      $scope.state = res.state;
      $scope.availableActions = res.actions;
    });
    $scope.year = new Date().getFullYear();
    
    $scope.executeAction = function(action){
        $http.get('/api/execute?action=' + action).success(function(res) {
          
        });
    };
  });
