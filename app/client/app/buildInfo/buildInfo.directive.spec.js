'use strict';

describe('Directive: buildInfo', function () {

  // load the directive's module and view
  beforeEach(module('appApp'));
  beforeEach(module('app/buildInfo/buildInfo.html'));

  var element, scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<build-info></build-info>');
    element = $compile(element)(scope);
    scope.$apply();
    expect(element.text()).toBe('this is the buildInfo directive');
  }));
});