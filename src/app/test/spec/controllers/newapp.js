'use strict';

describe('Controller: NewappCtrl', function () {

  // load the controller's module
  beforeEach(module('marinetApp'));

  var NewappCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    NewappCtrl = $controller('NewappCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
