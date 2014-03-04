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
    scope = $rootScope.$new();
    MainCtrl = $controller('MainCtrl', {
      $scope: scope
    });
  }));

  it('should define the current state to the scope', function () {
    expect(scope.state).toBeUndefined();
    $httpBackend.flush();
    expect(scope.state).toBe('connected');
  });
  
  it('should define available actions to the scope', function () {
    expect(scope.availableActions).toBeUndefined();
    $httpBackend.flush();
    expect(scope.availableActions).toEqual(['park', 'disconnect']);
  });
  
  it('should define the curent year', function () {
    var year = new Date().getFullYear();
    expect(scope.year).toBe(year);
  });
});
