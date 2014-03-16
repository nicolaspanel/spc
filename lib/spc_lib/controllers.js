'use strict';

var util = require('util'),
    events  = require('events'),
    regulators = require('./regulators');

var ParkController = function(){
  events.EventEmitter.call(this);
  this.name = '.park';
  this.regulator = new regulators.PIDRegulator({
    Ki: 1,
    Kp: 40,
    Kd: 1,
    dt: 50e-3
  });
  this.setMaxListeners(15);
};
util.inherits(ParkController, events.EventEmitter);

ParkController.prototype.handlePosition = function(position, callback) {
  if (typeof callback === 'function'){
    this.once('update-voltage', function(position) {
      callback(position);
    });
  }
  var self = this;
  this.regulator.getVoltage(position, 0, function(voltage) {
    self.emit('update-voltage', voltage);
  });
};
exports.ParkController = ParkController;

var DoNothingController = function(){
  events.EventEmitter.call(this);
  this.name = '.do-nothing';
};
util.inherits(DoNothingController, events.EventEmitter);

DoNothingController.prototype.handlePosition = function(position, callback) {
  if (typeof callback === 'function'){
    callback(0);
  }
};
exports.ParkController = ParkController;
exports.DoNothingController = DoNothingController;

exports.controllers = [
  new ParkController(),
  new DoNothingController()
];