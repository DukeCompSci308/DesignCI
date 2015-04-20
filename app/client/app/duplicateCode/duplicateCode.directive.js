'use strict';

angular.module('appApp')
  .directive('duplicateCode', function () {
    return {
      templateUrl: 'app/duplicateCode/duplicateCode.html',
      restrict: 'EA',
      link: function (scope, element, attrs) {
      }
    };
  });