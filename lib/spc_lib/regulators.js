'use strict';

var util = require('util'),
    events  = require('events'),
    numeric = require('numeric'),
    _ = require('underscore'),
    modelization = require('./modelization');

var PIDRegulator = function(args){
  events.EventEmitter.call(this);
  this.name = 'pid-regulator';
  args = args ? args : {};
  this.Ki = args.Ki ? args.Ki : 5;
  this.Kp = args.Kp ? args.Kp : 50;
  this.Kd = args.Kd ? args.Kd : 5;
  this.dt = args.dt ? args.dt : 50e-3;
  this._lastPosition = 0;
  this._lastErrors = [];
  this._prevError = 0;
};
util.inherits(PIDRegulator, events.EventEmitter);

PIDRegulator.prototype.getVoltage = function(currentPosition, expectedPosition, callback) {
  var e =  expectedPosition - currentPosition;
  var e_p = e;
  this._lastErrors.push(e * this.dt);
  this._lastErrors = _.last(this._lastErrors, 10);
  var e_i =  _.reduce(this._lastErrors, function(memo, num){ return memo + num; }, 0);
  var e_d = (e - this._prevError)/this.dt; 
  
  var u =  this.Ki * e_i + this.Kp * e_p + this.Kd * e_d;
  u = Math.min(Math.max(u, -12), 12); //clamp
  this._prevError = e;

  callback(u);
};

exports.PIDRegulator = PIDRegulator;