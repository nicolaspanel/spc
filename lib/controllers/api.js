'use strict';

var supervisor = require('../spc').SupervisorInstance,
    S = require('string');

exports.supervisorState = function(req, res) {
  var state = supervisor.state();
  state = S(state).humanize().s;
  res.json({
    state: state,
    actions: supervisor.availableActions()
  });
};

exports.robotState = function(req, res) {
  var position =  supervisor.lastReportedPosition;
  res.json({
    position: position
  });
};

exports.executeAction = function(req, res) {
  supervisor[req.query.action]();
  res.end();
};
