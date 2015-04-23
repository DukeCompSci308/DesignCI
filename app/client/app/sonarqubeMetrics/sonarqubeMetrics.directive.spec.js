'use strict';

describe('Directive: sonarqubeMetrics', function () {

  // load the directive's module and view
  beforeEach(module('appApp'));
  beforeEach(module('app/sonarqubeMetrics/sonarqubeMetrics.html'));

  var element, scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<sonarqube-metrics></sonarqube-metrics>');
    element = $compile(element)(scope);
    scope.$apply();
    expect(element.text()).toBe('this is the sonarqubeMetrics directive');
  }));
});