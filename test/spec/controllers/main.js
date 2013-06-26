'use strict';

describe('Controller: MainCtrl', function () {

  // load the controller's module
  beforeEach(module('TrelloAnalyzeApp'));

  var MainCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    MainCtrl = $controller('MainCtrl', {
      $scope: scope
    });
  }));

  it('should attach a model and an activeBoard to the scope', function () {
    expect(scope.model).toBe({ activeBoard: {}});
  });
});
