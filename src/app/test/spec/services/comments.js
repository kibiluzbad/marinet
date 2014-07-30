'use strict';

describe('Service: Comments', function () {

  // load the service's module
  beforeEach(module('marinetApp'));

  // instantiate service
  var Comments;
  beforeEach(inject(function (_Comments_) {
    Comments = _Comments_;
  }));

  it('should do something', function () {
    expect(!!Comments).toBe(true);
  });

});
