'use strict';

var firmata = require('firmata'), 
    spc = require('../spc');

/**
 * Supervisor configuration
 */
module.exports = function(server) {
  if (process.env.NODE_ENV === 'production'){
    var board = new firmata.Board('/dev/ttyACM0', function(err) {
      if (err) {
          console.log(err);
          return;
      }
      var robot = new spc.Robot(board);
      spc.SupervisorInstance.attachRobot(robot);
    });
  }else {
    var robot = new spc.FakeRobot();
    robot.setPosition(1);
    spc.SupervisorInstance.attachRobot(robot);
  }
  var io = require('socket.io').listen(server);
  io.on('connection', require('../controllers/socket').connect);
};