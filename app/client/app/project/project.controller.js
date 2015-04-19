'use strict';

angular.module('appApp')
  .controller('ProjectCtrl', function ($scope) {
    $scope.message = 'Hello';

    $scope.project = {
      building: false
    };
  });
