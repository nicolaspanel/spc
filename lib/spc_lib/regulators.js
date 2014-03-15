'use strict';

var util = require('util'),
    events  = require('events');

var PIDRegulator = function(){
  events.EventEmitter.call(this);
  this.name = 'pid-regulator';

  // // constants
  // var k_moteur        = 5e-3;
  // var r_moteur        = 5;
  // var r_frottements   = 2.5e-1;
  // var r_poulie        = 5e-2; 
  // var m_chariot       = 5e-2;

  // // Dynamics
  // var a = r_frottements / m_chariot - k_moteur^2 / (r_poulie^2*r_moteur*m_chariot);
  // this.A = [0, 1; 0, a];

  // var b = k_moteur / (r_moteur * r_poulie * m_chariot);
  // this.B = [0; b];

  // this.C = [1 0];
};
util.inherits(PIDRegulator, events.EventEmitter);

exports.PIDRegulator = PIDRegulator;