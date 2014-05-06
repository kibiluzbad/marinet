'use strict';

describe('Controller: AppsCtrl', function () {

  // load the controller's module
  beforeEach(module('marinetApp'));

  var AppsCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    AppsCtrl = $controller('AppsCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
