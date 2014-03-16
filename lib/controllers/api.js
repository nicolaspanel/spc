'use strict';

var supervisor = require('../spc').SupervisorInstance,
    S = require('string');

exports.supervisorState = function(req, res) {
  res.json(supervisor.fullState());
};

exports.robotState = function(req, res) {
  res.json(supervisor.robotState());
};

exports.executeAction = function(req, res) {
  supervisor[req.query.action]();
  res.end();
};

exports.connectIO = function(socket){
  supervisor.on('state-changed', function(newState, availableActions){
    socket.emit('state-changed', supervisor.fullState());
  });

  supervisor.on('robot-state-changed', function(robotState){
    socket.emit('robot-state-changed', robotState);
  });

  socket.on('event', function(data){});
  socket.on('disconnect', function(){});
};