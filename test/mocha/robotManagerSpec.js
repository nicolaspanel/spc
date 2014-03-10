'use strict';

var should = require('should'),
    spc = require('../../lib/spc'),
    mocks = require('./mocks');

describe('RobotManager', function () {
  var robot = null;
  beforeEach(function() {
    var board = new mocks.Board();
    robot = new spc.RobotManager(board);
  });
  it('should not be initialized', function(){
    robot.isInitialized().should.be.false;
  });
});