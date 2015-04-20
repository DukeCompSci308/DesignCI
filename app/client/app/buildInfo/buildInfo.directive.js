'use strict';

angular.module('appApp')
  .directive('buildInfo', function () {
    return {
      templateUrl: 'app/buildInfo/buildInfo.html',
      restrict: 'EA',
      scope: {
        build: '=buildDetails',
        name: '@buildName'
      },
      link: function (scope, element, attrs) {
      }
    };
  });
