'use strict';

describe('Filter: normalizedate', function () {

  // load the filter's module
  beforeEach(module('marinetApp'));

  // initialize a new instance of the filter before each test
  var normalizedate;
  beforeEach(inject(function ($filter) {
    normalizedate = $filter('normalizedate');
  }));

  it('should return the input prefixed with "normalizedate filter:"', function () {
    var text = 'angularjs';
    expect(normalizedate(text)).toBe('normalizedate filter: ' + text);
  });

});
