'use strict';

angular.module('appApp')
  .controller('ProjectCtrl', function ($scope, $stateParams, $http) {
    $scope.message = 'Hello';

    $scope.semesterName = $stateParams.semesterName ? $stateParams.semesterName : 'spring2015';
    $scope.projectName = $stateParams.projectName ? $stateParams.projectName : $stateParams.semesterName;

    $scope.metrics = {};

    var apiURL = '/api/jenkins/semester/' + $scope.semesterName + '/project/' + $scope.projectName;

    $http.get(apiURL).success(function(data) {
      $scope.project = data;
      console.log(data);
      $scope.project.building = $scope.project.jenkins.lastSuccessfulBuild.number == $scope.project.jenkins.lastCompletedBuild.number;

    });

    $http.get(apiURL + '/metrics').success(function(data) {
      $scope.metrics.jenkins = data;
      console.log(data);
    });
  });
