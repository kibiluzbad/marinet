'use strict';

describe('Controller: TopbarCtrl', function () {

  // load the controller's module
  beforeEach(module('marinetApp'));

  var TopbarCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    TopbarCtrl = $controller('TopbarCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
