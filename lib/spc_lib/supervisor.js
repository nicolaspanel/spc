'use strict';

var Stately = require('stately.js'),
    util = require('util'),
    events  = require('events');

var Supervisor = function(){
  events.EventEmitter.call(this);
  var supervisor = this; 
  supervisor.controller = null;
  supervisor._controllers = {};
  supervisor._lastReportedPosition = NaN;
  
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
    switch (transition) {
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

    if (oldState !== newState){
      supervisor.emit('state-changed', supervisor.state(), supervisor.availableActions());
    }
  });
  supervisor._fsm = fsm;
  return this;
};
util.inherits(Supervisor, events.EventEmitter);

Supervisor.prototype.attachRobot = function(robot) {
  this._robot = robot;
  var self = this;
  this._robot.on('position-changed', function(position){
    var supervisor = self;
    if (supervisor.controller){  
      supervisor.controller.handlePosition(position, function(voltage) {
        supervisor._robot.setVoltage(voltage);
      });

      if (position !== supervisor._lastReportedPosition){
        supervisor.emit('robot-state-changed', {
          position: position
        });
      }
    }
    
  });
};

Supervisor.prototype.state = function() {
  return this._fsm.getMachineState();
};

Supervisor.prototype.initialize = function(callback) {
  if (typeof callback === 'function'){
    this.once('connected', callback);
  }
  // setup controller and listen for update requests
  var ctrls = require('./controllers').controllers;
  var self = this;
  
  ctrls.forEach(function(ctrl) {
    self._controllers[ctrl.name] = ctrl;
  });

  
  if (!this._robot.isInitialized()){
    
    this._robot.initialize(function(){
      self.controller = self._controllers['.do-nothing'];
      self._fsm.initialize();
    });
  }else {
    this.controller = this._controllers['.do-nothing'];
    this._fsm.initialize(); 
  }
};

Supervisor.prototype.park = function(callback) {
  if (typeof callback === 'function'){
    this.once('parked', callback);
  }

  // TODO : Add setzero procedure.

  this.controller = this._controllers['.park'];
  this._fsm.park();
};

Supervisor.prototype.disconnect = function(callback) {
  if (typeof callback === 'function'){
    this.once('disconnected', callback);
  }
  
  this._controllers = {};
  this.controller = null;
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
      return [{
        name: 'initialize', 
        description: 'Connect the board',
        type:   'primary'
      }];
    case 'CONNECTED' : 
      return [
      {
        name: 'park',
        description: 'Maintain carriage at initial position (zero)',
        type: 'primary'
      }, 
      {
          name: 'disconnect',
          description: 'Stop all activities and disconnect the board',
          type: 'danger'
      }];
    case 'PARKED' : 
      return [
        { 
            name: 'train',
            description: 'Launch training process',
            type: 'success'
        },
        {
            name: 'track',
            description: 'Start position tracking',
            type: 'success'
        }, 
        {
            name: 'disconnect',
            description: 'Stop all activities and disconnect the board',
            type: 'danger'
        }
      ];
    case 'TRAINING' : 
      return [
        {
          name: 'stopTraining',
          description: 'stop training and go back to initial position',
          type: 'primary'
        }, 
        {
          name: 'disconnect',
          description: 'Stop all activities and disconnect the board',
          type: 'danger'
        }
      ];
    case 'TRACKING' :
      return [
        {
          name: 'stopTracking',
          description: 'Pause tracking and go back to initial position',
          type: 'primary'
        }, 
        {
          name: 'disconnect',
          description: 'Stop all activities and disconnect the board',
          type: 'danger'
        }
      ];
    default : 
      return [];
  }
};
exports.Supervisor = Supervisor;