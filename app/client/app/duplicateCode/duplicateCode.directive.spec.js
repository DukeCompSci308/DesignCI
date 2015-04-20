'use strict';

describe('Directive: duplicateCode', function () {

  // load the directive's module and view
  beforeEach(module('appApp'));
  beforeEach(module('app/duplicateCode/duplicateCode.html'));

  var element, scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<duplicate-code></duplicate-code>');
    element = $compile(element)(scope);
    scope.$apply();
    expect(element.text()).toBe('this is the duplicateCode directive');
  }));
});