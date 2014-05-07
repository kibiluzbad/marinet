'use strict';

describe('Service: apps', function () {

  // load the service's module
  beforeEach(module('marinetApp'));

  // instantiate service
  var apps;
  beforeEach(inject(function (_apps_) {
    apps = _apps_;
  }));

  it('should do something', function () {
    expect(!!apps).toBe(true);
  });

});
