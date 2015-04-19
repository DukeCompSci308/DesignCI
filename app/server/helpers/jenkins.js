var express = require('express');

var winston = require('./logger');
var verify = require('./verify');

var config = require('../config/jenkins.js');

String.prototype.capitalize = function () {
    return this && this[0].toUpperCase() + this.slice(1);
};

var jenkinsHelper = function() {
    var jenkinsapi = require('jenkins-api');
    var connection = "http://" + config.jenkins.username + ":" + config.jenkins.api_token + "@" + config.jenkins.server;
    var jenkins = jenkinsapi.init(connection);

    var processOrganizationName = function(org) {
        var parts = org.split('-');

        var semesterSection = parts[parts.length - 1];
        var semester =  semesterSection.match(/([a-z]+)([0-9]+)/);
        var year = semester[2];
        semester = semester[1];

        // capitalize the semester
        semester = semester.capitalize() + ' ' + year;

        return semester;
    };

    var processRepoName = function(repoName) {
        // ["slogo_team02", "slogo", "team", "02"]
        var repoParts = repoName.match(/([a-z]+)_([a-z]+)(\d+)?/i);
        var projectName = repoParts[1].capitalize();
        var teamName = repoParts[2].capitalize();
        teamName = repoParts[3] ? teamName + ' ' + repoParts[3] : teamName;

        return {
            project: projectName,
            team: teamName
        };
    };

    var getJobs = function(callback) {
        var response = true;
        while (response) {
            jenkins.all_jobs(function(err, data) {
                if (!err) {
                    for (var job in data) {
                        loadJobInfo(job, function(data) {
                            job.children = data;
                        });
                    }
                }
            });
        }
    };

    var loadJobInfo = function(parent, callback) {

    };

    var createJob = function(repo) {
        var semester = processOrganizationName(repo.owner.login);
        var project = processRepoName(repo.name);

        jenkins.build('Job Creator', {
            SEMESTER: semester,
            PROJECT: project.project,
            TEAM: project.team,
            GITHUB_ORG: repo.owner.login,
            GITHUB_REPO: repo.name
         }, function(err, data) {
            if (err) {
                winston.error(err);
                return;
            }
            winston.info(data);
        });
    };

    return {
        api: jenkins,
        createJob: createJob,
        getJobs: getJobs,
        parseRepoName: processRepoName,
        getSemester: processOrganizationName
    }
};

module.exports = jenkinsHelper();
