'use strict';

describe('Directive: butterbar', function () {

  // load the directive's module
  beforeEach(module('marinetApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<butterbar></butterbar>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the butterbar directive');
  }));
});
