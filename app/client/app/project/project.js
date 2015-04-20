'use strict';

angular.module('appApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('project', {
        url: '/project/:semesterName/:projectName',
        templateUrl: 'app/project/project.html',
        controller: 'ProjectCtrl'
      });
  });
