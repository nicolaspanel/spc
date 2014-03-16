'use strict';

var util = require('util'),
    events  = require('events'),
    numeric = require('numeric');

var Modelization = function(){

  // constants
  var k_moteur        = 5e-3;
  var r_moteur        = 5;
  var r_frottements   = 2.5e-1;
  var r_poulie        = 5e-2; 
  var m_chariot       = 5e-2;

  // Dynamics
  var a = -1 / m_chariot * (k_moteur * k_moteur / (r_poulie * r_poulie* r_moteur) + r_frottements);
  this.A = [[0, 1], [0, a]];

  var b = k_moteur / (r_moteur * r_poulie * m_chariot);
  this.B = [[0], [b]];

  this.C = [[1,0]];

  this.position = 0;
  this.speed = 0;
};

Modelization.prototype._modelization = function(t, x, u) {
  var ax = numeric.dot(this.A, x);
  var bu = numeric.dot(this.B, [u]);
  return numeric.add(ax, bu);
};

Modelization.prototype.setState = function(position, speed) {
  this.position = position;
  this.speed = speed;
};
Modelization.prototype.applyVoltage = function(voltage, duration) {
  var self = this;
  var system = function(t, x) {
    return self._modelization(t, x, voltage);
  };
  var sol = numeric.dopri(0, duration, [this.position, this.speed], system, 1e-6, 100);
  this.position = sol.at(duration)[0];
  this.speed = sol.at(duration)[1];
  return {
    position: this.position,
    speed: this.speed
  };

};
exports.Modelization = Modelization;