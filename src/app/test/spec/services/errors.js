'use strict';

describe('Service: Errors', function () {

  // load the service's module
  beforeEach(module('marinetApp'));

  // instantiate service
  var Errors;
  beforeEach(inject(function (_Errors_) {
    Errors = _Errors_;
  }));

  it('should do something', function () {
    expect(!!Errors).toBe(true);
  });

});
