'use strict';
var util = require('util'),
    events  = require('events'),
    sinon = require('sinon');

var MockBoard = function(){
  events.EventEmitter.call(this);
  this.attachEncoder = sinon.spy();
  this.setSamplingInterval = sinon.spy();
  this.toggleEncodersPositionsReports = sinon.spy();
  this.pinMode = sinon.spy();
  this.analogWrite = sinon.spy();
  this.digitalWrite = sinon.spy();
};
util.inherits(MockBoard, events.EventEmitter);


var MockRobot = function(){
  events.EventEmitter.call(this);
};
util.inherits(MockRobot, events.EventEmitter);
MockRobot.prototype.initialize = function(cb) {
  if (typeof cb === 'function'){
    cb();
  }
};
MockRobot.prototype.isInitialized = function() {
  return false;
};
MockRobot.prototype.setVoltage = function(voltage) {
  
};

exports.Board = MockBoard;
exports.Robot = MockRobot;