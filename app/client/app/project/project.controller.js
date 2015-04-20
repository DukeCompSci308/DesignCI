'use strict';

angular.module('appApp')
  .controller('ProjectCtrl', function ($scope, $stateParams, $http) {
    $scope.message = 'Hello';
    $scope.projectName = $stateParams.projectName;

    $http.get('/api/jenkins/' + $stateParams.projectName).success(function(data) {
      $scope.project = data;
      console.log(data);
    });
  });
