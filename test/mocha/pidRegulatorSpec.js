'use strict';

var should = require('should'),
    numeric = require('numeric'),
    spc = require('../../lib/spc');


describe('PID regulator', function () {
  var regulator = null;
  beforeEach(function() {
    regulator = new spc.PIDRegulator();
  });
  it('should define A as a 2x2 matrix', function(){
    numeric.dim(regulator.A).should.eql([2,2]);
  });

  it('should define B as a 2x1 matrix', function(){
    numeric.dim(regulator.B).should.eql([2, 1]);
  });

  it('should define C as a 1x2 matrix', function(){
    numeric.dim(regulator.C).should.eql([1, 2]);
  });
});