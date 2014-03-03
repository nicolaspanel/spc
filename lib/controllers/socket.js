'use strict';
var supervisor = require('../spc_lib/supervisor').SupervisorInstance;

exports.connection = function(socket){
  supervisor.on('state-changed', function(newState, availableActions){
    socket.emit('state-changed', {
      state: newState,
      actions: supervisor.availableActions()
    });
  });

  socket.on('event', function(data){});
  socket.on('disconnect', function(){});
};