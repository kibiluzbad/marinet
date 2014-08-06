'use strict';

describe('Directive: onEnter', function () {

  // load the directive's module
  beforeEach(module('marinetApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<on-enter></on-enter>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the onEnter directive');
  }));
});
