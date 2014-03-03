'use strict';


/**
 * Main application file
 */

// Default node environment to development
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

// Application Config
var config = require('./lib/config/config');

var app = require('express')();

// Express settings
require('./lib/config/express')(app);

// Routing
require('./lib/routes')(app);

var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
io.on('connection', require('./lib/controllers/socket').connection);

// Start server
server.listen(config.port, function () {
  console.log('Express server listening on port %d in %s mode', config.port, app.get('env'));
});

// Expose app
exports = module.exports = app;