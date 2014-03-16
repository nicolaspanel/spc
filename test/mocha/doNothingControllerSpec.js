'use strict';

var should = require('should'),
    spc = require('../../lib/spc');


describe('DoNothingController', function () {
  var ctrl = null;
  beforeEach(function() {
    ctrl = new spc.DoNothingController();
  });
  it('should be named \'do-nothing-ctrl\'', function(){
    ctrl.name.should.equal('do-nothing-ctrl');
  });

  describe('when receive current position', function() {
    it('should always return 0', function(done){
      ctrl.handlePosition(0.23, function(voltage) {
        voltage.should.equal(0);
        done();
      });
    });
  });
});