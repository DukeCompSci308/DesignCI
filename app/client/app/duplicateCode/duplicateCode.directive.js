'use strict';

angular.module('appApp')
  .directive('duplicateCode', function () {
    return {
      templateUrl: 'app/duplicateCode/duplicateCode.html',
      scope: {
        metrics: '=metrics'
      },
      restrict: 'EA',
      link: function (scope, element, attrs) {

      }
    };
  });
