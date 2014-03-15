'use strict';

var should = require('should'),
    spc = require('../../lib/spc');


describe('ParkController', function () {
  var ctrl = null;
  beforeEach(function() {
    ctrl = new spc.ParkController();
  });
  it('should be named \'park-ctrl\'', function(){
    ctrl.name.should.equal('park-ctrl');
  });

  it('should use \'pid-regulator\'', function(){
    ctrl.regulator.name.should.equal('pid-regulator');
  });

  describe('when receive current position', function() {
    it('should update voltage to zero if robot already parked', function(done){
      ctrl.once('update-voltage', function(voltage){
        voltage.should.equal(0);
        done();
      });
      ctrl.handlePosition(0);
    });

    // it('should apply negative voltage if robot\'s postion is above park position', function(done){
    //   ctrl.once('update-voltage', function(voltage){
    //     voltage.should.be.lessThan(0);
    //     done();
    //   });
    //   ctrl.handlePosition(0.1);
    // });
  });
});