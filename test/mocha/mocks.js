'use strict';
var util = require('util'),
    events  = require('events');

var MockBoard = function(){
  events.EventEmitter.call(this);
};

util.inherits(MockBoard, events.EventEmitter);
exports.Board = MockBoard;