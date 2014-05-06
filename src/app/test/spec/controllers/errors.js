'use strict';

describe('Controller: ErrorsCtrl', function () {

  // load the controller's module
  beforeEach(module('marinetApp'));

  var ErrorsCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ErrorsCtrl = $controller('ErrorsCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
