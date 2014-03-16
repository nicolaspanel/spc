'use strict';

var should = require('should'),
    numeric = require('numeric'),
    spc = require('../../lib/spc');


describe('PID regulator', function () {
  var regulator = null;
  beforeEach(function() {
    regulator = new spc.PIDRegulator();
  });
  
  it('should have Ki define to 5 by default', function(){
    regulator.Ki.should.equal(5);
  });

  it('should have Kp define to 50 by default', function(){
    regulator.Kp.should.equal(50);
  });

  it('should have Kd define to 5 by default', function(){
    regulator.Kd.should.equal(5);
  });

  it('should have dt define to 50ms by default', function(){
    regulator.dt.should.equal(50e-3);
  });

  it('should apply -12V if robot\'s far from park position', function(done){
    regulator.getVoltage(0.5, 0, function(voltage) {
      voltage.should.equal(-12);
      done();
    });
  });

  it('should apply position voltage if robot\'s postion is above park position', function(done){
    regulator.getVoltage(-0.005, 0, function(voltage) {
      voltage.should.be.greaterThan(0);
      done();
    });
  });
});