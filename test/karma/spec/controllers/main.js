'use strict';

describe('Controller: MainCtrl', function () {

  // load the controller's module
  beforeEach(module('webApp'));

  var MainCtrl,
    scope,
    $httpBackend;

  // Initialize the controller and a mock scope
  beforeEach(inject(function (_$httpBackend_, $controller, $rootScope) {
    $httpBackend = _$httpBackend_;
    $httpBackend.expectGET('/api/awesomeThings')
      .respond(['HTML5 Boilerplate', 'AngularJS', 'Karma', 'Express']);
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

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings).toBeUndefined();
    $httpBackend.flush();
    expect(scope.awesomeThings.length).toBe(4);
  });

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
