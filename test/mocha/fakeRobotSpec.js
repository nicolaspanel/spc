'use strict';

var should = require('should'),
    spc = require('../../lib/spc'),
    mocks = require('./mocks'),
    sinon = require('sinon');

describe('FakeRobot', function () {
  var robot = null;
  
  
  beforeEach(function() {
    robot = new spc.FakeRobot();
  });
  it('should not be initialized', function(){
    robot.isInitialized().should.be.false;
  });

  it('should be able to report its state', function(){
    robot.state().should.have.property('position');
    robot.state().should.have.property('speed');
    robot.state().should.have.property('voltage');
    robot.state().should.have.property('datetime');
  });
  
  describe('during initialization', function()
  {
    beforeEach(function(done) {
      robot.initialize(function(){
        done();
      });
    });
    
    it('should not be at the end stop', function(){
      robot.isAtEndStop().should.be.false;
    });
  
    it('should raise the new position every 50ms', function(done){
      robot.once('position-changed', function(position){
        position.should.equal(0);
        done();
      });
    });

    it('should raise \'reach-end-stop\' when reach position of -0.01', function(done){
      robot.once('reach-end-stop', function(){
        done();
      });
      robot.setVoltage(-12);
    });

  });
  
});