angular.module('webApp')
  .controller('GaugeCtrl', ['$scope', 'socket', function ($scope, socket) {
    // gauge
    $scope.gauge = {};
    $scope.gauge.value = 0;
    $scope.gauge.upperLimit = 1.1;
    $scope.gauge.lowerLimit = 0;
    $scope.gauge.unit = "m/s";
    $scope.gauge.precision = 0.2;
    $scope.gauge.ranges = [
      {
        min: 0,
        max: 0.2,
        color: '#DEDEDE'
      },
      {
        min: 0.2,
        max: 0.7,
        color: '#8DCA2F'
      },
      {
        min: 0.7,
        max: 0.85,
        color: '#FDC702'
      },
      {
        min: 0.85,
        max: 1.0,
        color: '#FF7700'
      },
      {
        min: 1.0,
        max: 1.1,
        color: '#C50200'
      }
    ];
    socket.on('robot-state-changed', function(data) {
      $scope.gauge.value = Math.round(Math.abs(data.speed)*10)/10;
    });
  }]);