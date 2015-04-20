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
        console.log(scope);
        scope.$watch('build', function(newValue, oldValue) {
          if (newValue)
            console.log(newValue);
        }, true);
      }
    };
  });
