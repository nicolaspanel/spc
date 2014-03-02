'use strict';
var supervisor = require('../spc_lib/supervisor').SupervisorInstance,
    S = require('string');

exports.supervisorState = function(req, res) {
  var state = supervisor.state();
  state = S(state).capitalize().replaceAll('_', ' ').s;
  res.json({
    state: state,
    actions: supervisor.availableActions()
  });
};

exports.executeAction = function(req, res) {
  supervisor[req.query.action]();
};
