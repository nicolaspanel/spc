'use strict';

describe('Controller: MainCtrl', function () {

  // load the controller's module
  beforeEach(module('webApp'));

  var MainCtrl,
      scope,
      $httpBackend;

  // Initialize the controller and a mock scope
  beforeEach(inject(function (socket, _$httpBackend_, $controller, $rootScope) {
    $httpBackend = _$httpBackend_;
    $httpBackend.expectGET('/api/state')
      .respond({
        state: 'connected',
        actions: ['park', 'disconnect']
      });
    $httpBackend.expectGET('/api/robot-state')
      .respond({
        position: 1
      });
    scope = $rootScope.$new();
    MainCtrl = $controller('MainCtrl', {
      $scope: scope
    });
  }));

  it('should define the current state to the scope', function () {
    expect(scope.model.state).toBeUndefined();
    $httpBackend.flush();
    expect(scope.model.state).toBe('connected');
  });
  
  it('should define available actions to the scope', function () {
    expect(scope.model.availableActions).toBeUndefined();
    $httpBackend.flush();
    expect(scope.model.availableActions).toEqual(['park', 'disconnect']);
  });

  it('should define robot position to the scope', function () {
    expect(scope.model.position).toBeUndefined();
    $httpBackend.flush();
    expect(scope.model.position).toEqual(1);
  });
  
  it('should define the curent year', function () {
    var year = new Date().getFullYear();
    expect(scope.model.year).toBe(year);
  });
});
