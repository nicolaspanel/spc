'use strict';

var util = require('util'),
    events  = require('events'),
    model = require('./modelization');

var FakeRobot = function(){
  events.EventEmitter.call(this);
  // private prop.
  this._initialized = false;
  this._voltage = 0;
  
  this._modelization = new model.Modelization();
  var self = this;
  setInterval(function() {
    if (self._initialized){
      var result = self._modelization.applyVoltage(self._voltage, 0.050);
      self.emit('position-changed', result.position);
      if (result.position <= 0.01){
        self.emit('reach-end-stop');
      }
    }
  }, 50);
};
util.inherits(FakeRobot, events.EventEmitter);

FakeRobot.prototype.initialize = function(callback) {
  if (typeof callback === 'function'){
    this.once('initialized', callback);
  }
  this._initialized = true;
  this.emit('initialized');
};
FakeRobot.prototype.isInitialized = function() {
  return this._initialized;
};

FakeRobot.prototype.setPosition = function(expectedPosition) {
  this._modelization.setState(expectedPosition, 0);
};

FakeRobot.prototype.setVoltage = function(voltage) {
  this._voltage = voltage;
  return true;
};

FakeRobot.prototype.isAtEndStop = function() {
  return this._modelization.position <= -0.01;
};

exports.FakeRobot = FakeRobot;