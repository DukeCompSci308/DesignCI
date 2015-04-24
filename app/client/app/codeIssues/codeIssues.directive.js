'use strict';

angular.module('appApp')
  .directive('codeIssues', function () {
    return {
      templateUrl: 'app/codeIssues/codeIssues.html',
      restrict: 'EA',
      scope: {
        metrics: '=metrics'
      },
      link: function (scope, element, attrs) {
      }
    };
  });
