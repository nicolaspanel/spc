'use strict';

var should = require('should'),
    spc = require('../../lib/spc'),
    mocks = require('./mocks'),
    sinon = require('sinon');

describe('Robot', function () {
  var robot = null;
  var board = null;
  var encoderPinA = 2;
  var encoderPinB = 3;
  var dirPin1 = 7;
  var dirPin2 = 8;
  var pwmPin = 6;
  var inputPin = 4;
  
  beforeEach(function() {
    board = new mocks.Board();
    robot = new spc.Robot(board);
  });
  it('should not be initialized', function(){
    robot.isInitialized().should.be.false;
  });
  
  it('should be able to report its state', function(){
    robot.state().should.eql({
      position: 0,//meters
      speed: '?',
      atEndStop : false
    });
  });

  describe('during initialization', function()
  {
    beforeEach(function(done) {
      robot.initialize(function(){
        done();
      });
    });
    it('should attach encoder ', function(){
      board.attachEncoder.calledWith(0, encoderPinA, encoderPinB).should.be.true;
    });
    it('should set SamplingInterval to 50ms', function(){
      board.setSamplingInterval.calledWith(50).should.be.true;
    });
    it('should set dir pins as outputs', function(){
      board.pinMode.calledWith(dirPin1, 0x01).should.be.true;
      board.pinMode.calledWith(dirPin2, 0x01).should.be.true;
    });
    it('should set pwm pin as PWM', function(){
      board.pinMode.calledWith(pwmPin, 0x03).should.be.true;
    });
    it('should set input_pin as INPUT pin', function(){
      board.pinMode.calledWith(inputPin, 0x00).should.be.true;
    });
    it('should have enabled reports', function(){
      board.toggleEncodersPositionsReports.calledWith(true).should.be.true;
    });
    it('should be defined as initialized', function(){
      robot.isInitialized().should.be.true;
    });
    it('should not be at the end stop', function(){
      robot.isAtEndStop().should.be.false;
    });
  });
  
  describe('when update voltage to 0', function(){

    beforeEach(function() {
      robot.setVoltage(0);
    });
    
    it('should not have update PWM pin value', function(){
      sinon.assert.notCalled(board.analogWrite);
    });
    
    it('should not have update DIR pin 1/2 value', function(){
      sinon.assert.notCalled(board.digitalWrite);
    });
    
  });

  describe('when update voltage to -6v', function(){

    beforeEach(function() {
      robot.setVoltage(-6);
    });
    it('should have updated PWM  pin value to 128', function(){
      board.analogWrite.calledWith(pwmPin, 128).should.be.true;
    });
    it('should have updated DIR1  value to LOW', function(){
      board.digitalWrite.calledWith(dirPin1, 0).should.be.true;
    });
    it('should have updated DIR2  value to HIGH', function(){
      board.digitalWrite.calledWith(dirPin2, 1).should.be.true;
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

  it('should raise \'reach-end-stop\' when end stop pressed', function(done){
    robot.on('reach-end-stop', function(){
      done();
    });
    board.emit('digital-read-' + inputPin, 0);
  });
});