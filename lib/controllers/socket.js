'use strict';
var supervisor = require('../spc').SupervisorInstance;

exports.connect = function(socket){
  supervisor.on('state-changed', function(newState, availableActions){
    socket.emit('state-changed', {
      state: newState,
      controller: supervisor.controller? supervisor.controller.name : 'none',
      actions: supervisor.availableActions()
    });
  });

  supervisor.on('robot-state-changed', function(newState){
    socket.emit('robot-state-changed', newState);
  });

  socket.on('event', function(data){});
  socket.on('disconnect', function(){});
};