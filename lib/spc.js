'use strict';

exports.RobotManager = require('./spc_lib/robotManager').RobotManager;
exports.Modelization = require('./spc_lib/modelization').Modelization;

// Controllers
exports.ParkController = require('./spc_lib/controllers').ParkController;

// Regulators
exports.PIDRegulator = require('./spc_lib/regulators').PIDRegulator;

exports.Supervisor = require('./spc_lib/supervisor').Supervisor;
exports.SupervisorInstance = new require('./spc_lib/supervisor').Supervisor();
