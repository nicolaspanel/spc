'use strict';

exports.Robot = require('./spc_lib/robot').Robot;
exports.FakeRobot = require('./spc_lib/fakeRobot').FakeRobot;
exports.Modelization = require('./spc_lib/modelization').Modelization;

// Controllers
exports.ParkController = require('./spc_lib/controllers').ParkController;
exports.DoNothingController = require('./spc_lib/controllers').DoNothingController;

// Regulators
exports.PIDRegulator = require('./spc_lib/regulators').PIDRegulator;
var Supervisor = require('./spc_lib/supervisor').Supervisor;
exports.Supervisor = Supervisor;

exports.SupervisorInstance = new Supervisor();
