'use strict';

var should = require('should'),
    spc = require('../../lib/spc'),
    mocks = require('./mocks'),
    sinon = require('sinon');

describe('RobotManager', function () {
  var robot = null;
  var board = null;
  beforeEach(function() {
    board = new mocks.Board();
    robot = new spc.RobotManager(board);
  });
  it('should not be initialized', function(){
    robot.isInitialized().should.be.false;
  });
  
  describe('during initialization', function()
  {
    beforeEach(function(done) {
      board.attachEncoder = sinon.spy();
      board.setSamplingInterval = sinon.spy();
      board.toggleEncodersPositionsReports = sinon.spy();
      board.pinMode = sinon.spy();
      robot.initialize(function(){
        done();
      });
    });
    it('should call board#attachEncoder ', function(){
      board.attachEncoder.calledWith(0, 2, 3).should.be.true;
    });
    it('should call board#setSamplingInterval ', function(){
      board.setSamplingInterval.calledWith(50).should.be.true;
    });
    it('should call board#pinMode(4, PWM) ', function(){
      board.pinMode.calledWith(4, 0x03).should.be.true;
    });
    it('should have enabled reports', function(){
      board.toggleEncodersPositionsReports.calledWith(true).should.be.true;
    });
    it('should be defined as initialized', function(){
      robot.isInitialized().should.be.true;
    });
  });
  describe('when update voltage', function()
  {
    beforeEach(function() {
      board.analogWrite = sinon.spy();
    });
    it('should send 0 when voltage is 0v', function(){
      robot.setVoltage(0);
      board.analogWrite.calledWith(4, 0).should.be.true;
    });
    
    it('should send 128 when voltage is 6v', function(){
      robot.setVoltage(6);
      board.analogWrite.calledWith(4, 128).should.be.true;
    });
    
    it('should send 0 when voltage is -1v', function(){
      robot.setVoltage(-1);
      board.analogWrite.calledWith(4, 0).should.be.true;
    });
    it('should send 255 when voltage is 12v', function(){
      robot.setVoltage(12);
      board.analogWrite.calledWith(4, 255).should.be.true;
    });
    it('should send 255 when voltage is 13v', function(){
      robot.setVoltage(13);
      board.analogWrite.calledWith(4, 255).should.be.true;
    });
  });
  
  it('should raise the new position when board raise new encoder position', function(done){
    robot.on('position-changed', function(position){
      position.should.equal(0);
      done();
    });
    board.emit('encoder-report-0', 0);
  });
  
  describe('when set inital position to -5mm', function()
  {
    beforeEach(function() {
      robot.setPosition(-5e-3);
    });
    it('should manage the offset', function(done){
      robot.on('position-changed', function(position){
        position.should.equal(-5e-3);
        done();
      });
      board.emit('encoder-report-0', 0);
    });
  });
  
});