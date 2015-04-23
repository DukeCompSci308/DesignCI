'use strict';

angular.module('appApp')
  .directive('sonarqubeMetrics', function () {
    return {
      scope: {
        metrics: '=metrics'
      },
      templateUrl: 'app/sonarqubeMetrics/sonarqubeMetrics.html',
      restrict: 'EA',
      link: function (scope, element, attrs) {
      }
    };
  });
