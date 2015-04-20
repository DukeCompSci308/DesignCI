'use strict';

angular.module('appApp')
  .controller('ProjectCtrl', function ($scope, $stateParams, $http) {
    $scope.message = 'Hello';
    $scope.projectName = $stateParams.projectName;
    $scope.metrics = {};

    $http.get('/api/jenkins/' + $stateParams.projectName).success(function(data) {
      $scope.project = data;
      console.log(data);
    });

    $http.get('/api/jenkins/' + $stateParams.projectName + '/metrics').success(function(data) {
      $scope.metrics.jenkins = data;
      console.log(data);
    });
  });
