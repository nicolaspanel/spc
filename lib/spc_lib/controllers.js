'use strict';

var util = require('util'),
    events  = require('events'),
    regulators = require('./regulators');

var ParkController = function(){
  events.EventEmitter.call(this);
  this.name = 'park-ctrl';
  this.regulator = new regulators.PIDRegulator();
};
util.inherits(ParkController, events.EventEmitter);
ParkController.prototype.handlePosition = function(position) {
  var newVoltage = 0;
  this.emit('update-voltage', newVoltage);
};

exports.ParkController = ParkController;
exports.controllers = [
  new ParkController()
];