'use strict';

exports.RobotManager = require('./spc_lib/robotManager').RobotManager;
exports.ParkController = require('./spc_lib/controllers').ParkController;
exports.Supervisor = require('./spc_lib/supervisor').Supervisor;
exports.SupervisorInstance = new require('./spc_lib/supervisor').Supervisor();
