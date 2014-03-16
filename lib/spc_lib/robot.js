'use strict';

var util = require('util'),
    events  = require('events'),
    S = require('string');

var Robot = function(board){
  events.EventEmitter.call(this);
  // private prop.
  this._board = board;
  this._offset = 0;
  this._initialized = false;
  this._counter = 0;
  this._LPI = 200;
  this.ENCODER_PIN_A = 2;
  this.ENCODER_PIN_B = 3;
  this.DIR_PIN1 = 7;
  this.DIR_PIN2 = 8;
  this.PWM_PIN = 6;
  this.INPUT_PIN = 4;
  this._voltage = 0;
  this._isEndStopPressed = false;
  
  var self = this;

  board.on('encoder-report-0', function(count){
    self._counter = count;
    var newPosition = count * 0.0254 / self._LPI;
    self.emit('position-changed', newPosition + self._offset);
  });
  
  board.on('digital-read-' + this.INPUT_PIN, function(state){
    if (state === 0 && !self._isEndStopPressed) {
      self._isEndStopPressed = true;
      self.emit('reach-end-stop');
    } else if (state === 1 && self._isEndStopPressed){
      self._isEndStopPressed = false;
      self.emit('leave-end-stop');
    }
  });
  
};
util.inherits(Robot, events.EventEmitter);

Robot.prototype.initialize = function(callback) {
  if (typeof callback === 'function'){
    this.once('initialized', callback);
  }
  this._board.setSamplingInterval(50);
  this._board.pinMode(this.DIR_PIN1, 0x01);
  this._board.pinMode(this.DIR_PIN2, 0x01);
  this._board.pinMode(this.PWM_PIN, 0x03);
  this._board.pinMode(this.INPUT_PIN, 0x00);

  this._board.attachEncoder(0, this.ENCODER_PIN_A, this.ENCODER_PIN_B);
  this._board.toggleEncodersPositionsReports(true);
  var self = this;
  setTimeout(function(){ // wait a little
    self._initialized = true;
    self.emit('initialized');
  }, 200);
};
Robot.prototype.isInitialized = function() {
  return this._initialized;
};

Robot.prototype.setPosition = function(expectedPosition) {
  var currentPosition = this._counter * 0.0254 / this._LPI;
  this._offset = expectedPosition - currentPosition;
};

Robot.prototype.setVoltage = function(voltage) {
  var new_value =  Math.max(-12, Math.min(voltage, 12));
  if (this._voltage === new_value) { 
    return false;
  }
  var abs_value = Math.abs(new_value);
  if (Math.round(255 * abs_value / 12) !== Math.round(255 * this.abs_value / 12)){
    this._board.analogWrite(this.PWM_PIN, Math.round(255 * Math.abs(abs_value) / 12));
  }
  
  if (new_value < 0 && this._voltage >= 0) {
    this._board.digitalWrite(this.DIR_PIN1, 0);
    this._board.digitalWrite(this.DIR_PIN2, 1);
  } 
  else if (this._voltage < 0 && new_value >=0 ) {
    this._board.digitalWrite(this.DIR_PIN1, 1);
    this._board.digitalWrite(this.DIR_PIN2, 0);
  }
  this._voltage = new_value;
  return true;
};

Robot.prototype.isAtEndStop = function() {
  return this._isEndStopPressed;
};

Robot.prototype.state = function() {
  var pos = this._counter  * 0.0254 / this._LPI + this._offset;
  return {
    position : S(pos).toFloat(6),
    speed: '?',
    atEndStop: this._isEndStopPressed
  };
};

exports.Robot = Robot;