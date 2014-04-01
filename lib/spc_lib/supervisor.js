'use strict';

var Stately = require('stately.js'),
    util = require('util'),
    events  = require('events'),
    S = require('string');

var Supervisor = function(){
  events.EventEmitter.call(this);
  var supervisor = this; 
  supervisor.lastReportedPosition = NaN;
  supervisor.controller = null;
  supervisor._controllers = {};
  supervisor._counter = 0;
  var ctrls = require('./controllers').controllers;
  ctrls.forEach(function(ctrl) {
    supervisor._controllers[ctrl.name] = ctrl;
  });
  supervisor.controller = supervisor._controllers['do-nothing-ctrl'];

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
      'park': function() {
        this.setMachineState(this.PARKED);
      },
      'disconnect': function() {
        this.setMachineState(this.NEWBORN);
      }
    },
    'TRACKING' : {
      'park': function() {
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
        supervisor.emit('parked');
        break;
      case 'TRACKING => PARKED' :
        supervisor.emit('parked');
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
    supervisor.controller.handlePosition(position, function(voltage) {
      supervisor._robot.setVoltage(voltage);
    });
    
    if (self.state() !== 'NEWBORN' && self._counter % 2 === 0){
      console.log(self.state());
      supervisor.emit('robot-state-changed', supervisor._robot.state());
      supervisor.lastReportedPosition = position;
    }
    self._counter++;
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
  var self = this;
  
  if (!this._robot.isInitialized()){
    
    this._robot.initialize(function(){
      self.controller = self._controllers['do-nothing-ctrl'];
      self._fsm.initialize();
    });
  }else {
    this.controller = this._controllers['do-nothing-ctrl'];
    this._fsm.initialize(); 
  }
};

Supervisor.prototype.park = function(callback) {
  if (typeof callback === 'function'){
    this.once('parked', callback);
  }

  // TODO : Add setzero procedure.

  this.controller = this._controllers['park-ctrl'];
  this._fsm.park();
};

Supervisor.prototype.disconnect = function(callback) {
  if (typeof callback === 'function'){
    this.once('disconnected', callback);
  }
  
  this.controller = this._controllers['do-nothing-ctrl'];
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
  this.controller = this._controllers['track-ctrl'];
  this._fsm.track();
};

Supervisor.prototype.fullState = function() {
  return {
    state: S(this.state()).humanize().s,
    controller: S(this.controller.name).humanize().s,
    actions: this.availableActions()
  };
};
Supervisor.prototype.robotState = function() {
  return this._robot.state();
};

Supervisor.prototype.setTarget = function(target) {
  if (this.controller.name === 'track-ctrl') {
    this.controller.updateTarget(target);
  }
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
        // { 
        //     name: 'train',
        //     description: 'Launch training process',
        //     type: 'success'
        // },
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
          name: 'park',
          description: 'Stop training and lead carriage at initial position (zero)',
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
          name: 'park',
          description: 'Stop tracking and lead carriage at initial position (zero)',
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