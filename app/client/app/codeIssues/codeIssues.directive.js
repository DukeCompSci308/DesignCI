'use strict';

angular.module('appApp')
  .directive('codeIssues', function () {
    return {
      templateUrl: 'app/codeIssues/codeIssues.html',
      restrict: 'EA',
      link: function (scope, element, attrs) {
      }
    };
  });