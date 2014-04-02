'use strict';

var util = require('util'),
    events  = require('events'),
    regulators = require('./regulators');

var ParkController = function(){
  events.EventEmitter.call(this);
  this.name = 'park-ctrl';
  this.regulator = new regulators.PIDRegulator({
    Ki: 5,
    Kp: 62.5,
    Kd: 12.4,
    dt: 100e-3
  });
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
  this.name = 'do-nothing-ctrl';
};
util.inherits(DoNothingController, events.EventEmitter);

DoNothingController.prototype.handlePosition = function(position, callback) {
  if (typeof callback === 'function'){
    callback(0);
  }
};

var TrackController = function(){
  events.EventEmitter.call(this);
  this.name = 'track-ctrl';
  this._target = 0;
  this.regulator = new regulators.PIDRegulator({
    Ki: 10,
    Kp: 50,
    Kd: 10,
    dt: 150e-3
  });
};
util.inherits(TrackController, events.EventEmitter);

TrackController.prototype.handlePosition = function(position, callback) {
  if (typeof callback === 'function'){
    this.once('update-voltage', function(position) {
      callback(position);
    });
  }
  var self = this;
  this.regulator.getVoltage(position, this._target, function(voltage) {
    self.emit('update-voltage', voltage);
  });
};

TrackController.prototype.updateTarget = function(newTarget) {
  this._target = newTarget;
};

exports.TrackController = TrackController;
exports.ParkController = ParkController;
exports.DoNothingController = DoNothingController;

exports.controllers = [
  new ParkController(),
  new DoNothingController(),
  new TrackController()
];