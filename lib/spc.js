'use strict';

var Stately = require('stately.js'),
    util = require('util'),
    events  = require('events');

var RobotManager = function(board){
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
util.inherits(RobotManager, events.EventEmitter);

RobotManager.prototype.initialize = function(callback) {
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
RobotManager.prototype.isInitialized = function() {
  return this._initialized;
};

RobotManager.prototype.setPosition = function(expectedPosition) {
  var currentPosition = this._counter * 0.0254 / this._LPI;
  this._offset = expectedPosition - currentPosition;
};

RobotManager.prototype.setVoltage = function(voltage) {
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

RobotManager.prototype.isAtEndStop = function() {
  return this._isEndStopPressed;
};

var ParkController = function(){
  events.EventEmitter.call(this);
  this.name = 'park-ctrl';
};
util.inherits(ParkController, events.EventEmitter);

var controllers = [
  new ParkController()
];


var Supervisor = function(){
  events.EventEmitter.call(this);
  var supervisor = this; 
  supervisor.controller = null;
  supervisor._controllers = {};
  controllers.forEach(function(ctrl) {
    supervisor._controllers[ctrl.name] = ctrl;
  });
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
      supervisor.emit('state-changed', supervisor.state(), supervisor.availableActions());
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
  fsm.onenterPARKED = function (event, oldState, newState) {
    supervisor.controller = supervisor._controllers['park-ctrl'];
  };
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

exports.ParkController = ParkController;
exports.RobotManager = RobotManager;
exports.Supervisor = Supervisor;
exports.SupervisorInstance = new Supervisor();
