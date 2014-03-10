'use strict';

var should = require('should'),
    spc = require('../../lib/spc');


describe('ParkController', function () {
  var ctrl = null;
  beforeEach(function() {
    ctrl = new spc.ParkController();
  });
  it('should be named \'park-ctrl\'', function(){
    ctrl.name.should.equal('park-ctrl');
  });

  it('should be able to handle new states', function(){
    
  });
});