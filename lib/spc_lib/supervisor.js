var Stately = require('stately.js'),
    util = require('util'),
    events  = require('events');


var Supervisor = function(){
  events.EventEmitter.call(this);
  var supervisor = this; 
  var fsm = new Stately({
    'NEWBORN':{
      'initialize' : function(){
        this.setMachineState(this.CONNECTED);
      }
    },
    'CONNECTED' : {
      'park': function() {
        this.setMachineState(this.PARKED);
      },
      'disconnect': function() {
        this.setMachineState(this.NEWBORN);
      }
    },
    'PARKED' : {
      'disconnect': function() {
        this.setMachineState(this.NEWBORN);
      },
      'train': function() {
        this.setMachineState(this.TRAINING);
      },
      'track': function() {
        this.setMachineState(this.TRACKING);
      }
    },
    'TRAINING' : {
      'stop': function() {
        this.setMachineState(this.PARKED);
      },
      'disconnect': function() {
        this.setMachineState(this.NEWBORN);
      }
    },
    'TRACKING' : {
      'stop': function() {
        this.setMachineState(this.PARKED);
      },
      'disconnect': function() {
        this.setMachineState(this.NEWBORN);
      }
    }
  }).bind(function (event, oldState, newState) {
    var transition = oldState + ' => ' + newState;
    if (oldState !== newState){
      supervisor.emit('state-changed');
    }
    switch (transition) {
      /*
      case 'OLD_STATE => NEW_STATE':
      ...
      */
      case 'NEWBORN => CONNECTED' :
        supervisor.emit('connected');
        break;
      case 'CONNECTED => PARKED' :
        supervisor.emit('parked');
        break;
      case 'CONNECTED => NEWBORN' :
      case 'PARKED => NEWBORN' :
      case 'TRAINING => NEWBORN' :
      case 'TRACKING => NEWBORN' :
        supervisor.emit('disconnected');
        break;
      case 'PARKED => TRAINING' :
        supervisor.emit('training');
        break;
      case 'PARKED => TRACKING' :
        supervisor.emit('tracking');
        break;
      case 'TRAINING => PARKED' :
        supervisor.emit('stop-training');
        break;
      case 'TRACKING => PARKED' :
        supervisor.emit('stop-tracking');
        break;
      default:
        break;
    }
  });
  
  supervisor._fsm = fsm;
  return this;
};
util.inherits(Supervisor, events.EventEmitter);

Supervisor.prototype.state = function() {
  return this._fsm.getMachineState();
};
Supervisor.prototype.initialize = function(callback) {
  if (typeof callback === 'function'){
    this.once('connected', callback);
  }
  this._fsm.initialize();
};
Supervisor.prototype.park = function(callback) {
  if (typeof callback === 'function'){
    this.once('parked', callback);
  }
  this._fsm.park();
};
Supervisor.prototype.disconnect = function(callback) {
  if (typeof callback === 'function'){
    this.once('disconnected', callback);
  }
  this._fsm.disconnect();
};

Supervisor.prototype.train = function(callback) {
  if (typeof callback === 'function'){
    this.once('training', callback);
  }
  this._fsm.train();
};

Supervisor.prototype.track = function(callback) {
  if (typeof callback === 'function'){
    this.once('tracking', callback);
  }
  this._fsm.track();
};

Supervisor.prototype.stopTraining = function(callback) {
  if (typeof callback === 'function'){
    this.once('stop-training', callback);
  }
  this._fsm.stop();
};
Supervisor.prototype.stopTracking = function(callback) {
  if (typeof callback === 'function'){
    this.once('stop-tracking', callback);
  }
  this._fsm.stop();
};

Supervisor.prototype.availableActions = function() {
  switch(this.state()){
    case 'NEWBORN': 
      return ['initialize'];
    case 'CONNECTED' : 
      return ['park', 'disconnect'];
    case 'PARKED' : 
      return ['train','track', 'disconnect'];
    case 'TRAINING' : 
    case 'TRACKING' :
      return ['stop', 'disconnect'];
    default : 
      return [];
  }
};

exports.Supervisor = Supervisor;
exports.SupervisorInstance = new Supervisor();