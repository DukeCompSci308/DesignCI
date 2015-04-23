'use strict';

describe('Directive: codeIssues', function () {

  // load the directive's module and view
  beforeEach(module('appApp'));
  beforeEach(module('app/codeIssues/codeIssues.html'));

  var element, scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<code-issues></code-issues>');
    element = $compile(element)(scope);
    scope.$apply();
    expect(element.text()).toBe('this is the codeIssues directive');
  }));
});