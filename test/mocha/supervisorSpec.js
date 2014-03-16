'use strict';

var should = require('should'),
    spc = require('../../lib/spc'),
    mocks = require('./mocks'),
    sinon = require('sinon');

describe('supervisor', function () {
  var supervisor = null;
  var robot = null;
  beforeEach(function() {
    robot = new mocks.Robot();
    supervisor = new spc.Supervisor();
    supervisor.attachRobot(robot);
  });

  it('should be in \'NEWBORN\' state' ,function() {
    supervisor.state().should.eql('NEWBORN');
  });

  it('should only enable \'initialize\' action' ,function() {
    supervisor.availableActions().length.should.equal(1);
    supervisor.availableActions()[0].name.should.equal('initialize');
  });

  it('should raise an event when state change' ,function(done) {
    supervisor.once('state-changed', function(){
      done();
    });
    supervisor.initialize();
  });
  
  it('should send a connected message when initialized' ,function(done) {
    supervisor.once('connected', function(){
      done();
    });
    supervisor.initialize();
  });

  it('should initialize the robot if not already' ,function(done) {
    var spy = sinon.spy(robot, 'initialize');
    supervisor.initialize(function() {
      spy.calledOnce.should.be.true;
      done();
    });
  });

  describe('when initialized', function(){
    beforeEach(function(done) {
      supervisor.initialize( function() {
        done();
      });
    });
      
    it('should be connected', function() {
      supervisor.state().should.eql('CONNECTED');
    });


    it('should use the \'do-nothing\' controller', function() {
      supervisor.controller.name.should.eql('.do-nothing');
    });
    
    it('should be able to park', function(done) {
      supervisor.once('parked', function () {
        supervisor.state().should.eql('PARKED');
        done();
      });
      supervisor.park();
    });

    it('should emit new robot positions', function(done) {
      supervisor.on('robot-state-changed', function(state) {
        state.position.should.equal(0.0123);
        done();
      });
      robot.emit('position-changed', 0.0123);
    });
    
    it('can be disconnected', function(done) {
      supervisor.once('disconnected', function () {
        supervisor.state().should.eql('NEWBORN');
        done();
      });
      supervisor.disconnect();
    });
    
  });

  describe('when parked', function(){
    beforeEach(function(done) {
      supervisor.initialize(function() {
        supervisor.park(function() {
          done();
        });
      });
    });
    it('should be in parked state', function(){
      supervisor.state().should.eql('PARKED');
    });
    it('should use ParkController', function() {
      supervisor.controller.name.should.equal('.park');
    });
    it('can be disconnected', function(done) {
      supervisor.once('disconnected', function () {
        supervisor.state().should.eql('NEWBORN');
        done();
      });
      supervisor.disconnect();
    });

    it('can swich to training state', function(done) {
      supervisor.train(function(){
        supervisor.state().should.eql('TRAINING');
        done();
      });
    });

    it('can swich to tracking state', function(done) {
      supervisor.track(function(){
        supervisor.state().should.eql('TRACKING');
        done();
      });
    });
  });

  describe('when training', function(){
    beforeEach(function(done) {
      supervisor.initialize(function() {
        supervisor.park(function() {
          supervisor.train(function() {
            done();
          });
        });
      });
    });

    it('can stop training', function(done) {
      supervisor.stopTraining(function(){
        supervisor.state().should.eql('PARKED');
        done();
      });
    });
    it('can be disconnected', function(done) {
      supervisor.disconnect(function(){
        supervisor.state().should.eql('NEWBORN');
        done();
      });
    });

  });

  describe('when tracking', function(){
    beforeEach(function(done) {
      supervisor.initialize(function() {
        supervisor.park(function() {
          supervisor.track(function() {
            done();
          });
        });
      });
    });

    it('can stop tracking', function(done) {
      supervisor.stopTracking(function(){
        supervisor.state().should.eql('PARKED');
        done();
      });
    });
    it('can be disconnected', function(done) {
      supervisor.disconnect(function(){
        supervisor.state().should.eql('NEWBORN');
        done();
      });
    });

  });

});