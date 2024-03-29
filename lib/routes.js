'use strict';

var api = require('./controllers/api'),
    index = require('./controllers');

/**
 * Application routes
 */
module.exports = function(app) {

  // Server API Routes
  app.get('/api/state', api.supervisorState);
  app.get('/api/robot-state', api.robotState);
  app.get('/api/execute', api.executeAction);
  app.get('/api/updateTarget', api.updateTarget);
  

  // All other routes to use Angular routing in app/scripts/app.js
  app.get('/partials/*', index.partials);
  app.get('/*', index.index);
};