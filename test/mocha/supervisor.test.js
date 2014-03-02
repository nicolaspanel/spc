'use strict';

var should = require('should'),
    SPCSupervisor = require('../../lib/spc_lib/supervisor');


describe('supervisor', function () {
  var supervisor = null;
  beforeEach(function() {
    supervisor = new SPCSupervisor.Supervisor();
  });

  it('should be in \'NEWBORN\' state' ,function() {
    supervisor.state().should.eql('NEWBORN');
  });

  it('should only enable \'initialize\' action' ,function() {
    supervisor.availableActions().should.eql(['initialize']);
  });

  it('should raise an event when state change' ,function(done) {
    supervisor.once('state-changed', function(){
      done();
    });
    supervisor.initialize();
  });
  
  it('should send a connected message when initialized' ,function(done) {
    supervisor.initialize(function() {
      done();
    });
  });

  describe('when initialized', function(){
    beforeEach(function(done) {
      supervisor.initialize(function() {
        done();
      });
    });
      
    it('should be connected', function() {
      supervisor.state().should.eql('CONNECTED');
    });

    it('should be able to park', function(done) {
      supervisor.once('parked', function () {
        supervisor.state().should.eql('PARKED');
        done();
      });
      supervisor.park();
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