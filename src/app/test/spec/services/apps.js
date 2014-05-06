'use strict';

describe('Service: Apps', function () {

  // load the service's module
  beforeEach(module('marinetApp'));

  // instantiate service
  var Apps;
  beforeEach(inject(function (_Apps_) {
    Apps = _Apps_;
  }));

  it('should do something', function () {
    expect(!!Apps).toBe(true);
  });

});
