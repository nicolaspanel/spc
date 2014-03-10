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
exports.Board = MockBoard;