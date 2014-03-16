'use strict';

var should = require('should'),
    numeric = require('numeric'),
    spc = require('../../lib/spc');


describe('Modelization', function () {
  var modelization = null;
  beforeEach(function() {
    modelization = new spc.Modelization();
  });

  it('should be at position 0', function(){
    modelization.position.should.equal(0);
  });

  it('should be at speed 0', function(){
    modelization.speed.should.equal(0);
  });

  it('should define A as a 2x2 matrix', function(){
    numeric.dim(modelization.A).should.eql([2,2]);
  });

  it('should define B as a 2x1 matrix', function(){
    numeric.dim(modelization.B).should.eql([2, 1]);
  });

  it('should define C as a 1x2 matrix', function(){
    numeric.dim(modelization.C).should.eql([1, 2]);
  });

  it('should define C as a 1x2 matrix', function(){
    numeric.dim(modelization.C).should.eql([1, 2]);
  });
  describe('when at position zero with no speed', function () {
    beforeEach(function() {
      modelization.setState(0, 0);
    });
    it('should reach speed of 0.95m/s in less than 1.5s when applying 12v', function(){
      var state = modelization.applyVoltage(12, 1.5);
      state.speed.should.be.approximately(0.95,1e-1);
    });
  });
  describe('when speed is 1m/s and shut down power', function () {
    beforeEach(function() {
      modelization.setState(0, 1);
    });
    it('should stop in less than 1s', function(){
      var state = modelization.applyVoltage(0, 1);
      state.speed.should.be.approximately(0,1e-1);
    });
  });
});