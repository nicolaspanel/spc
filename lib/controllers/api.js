'use strict';
var supervisor = require('../spc_lib/supervisor').SupervisorInstance,
    S = require('string');
/**
 * Get awesome things
 */
exports.awesomeThings = function(req, res) {
  res.json([
    {
      name : 'HTML5 Boilerplate',
      info : 'HTML5 Boilerplate is a professional front-end template for building fast, robust, and adaptable web apps or sites.',
      awesomeness: 10
    }, {
      name : 'AngularJS',
      info : 'AngularJS is a toolset for building the framework most suited to your application development.',
      awesomeness: 10
    }, {
      name : 'Karma',
      info : 'Spectacular Test Runner for JavaScript.',
      awesomeness: 10
    }, {
      name : 'Express',
      info : 'Flexible and minimalist web application framework for node.js.',
      awesomeness: 10
    }
  ]);
};

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
