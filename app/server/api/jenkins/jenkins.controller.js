'use strict';

var _ = require('lodash');

var jenkins = require('../../helpers/jenkins');
var sonarqube = require('../../helpers/sonarqube');

var request = require('request');

var async = require('async');

var buildAPIURL = function(semester, job) {
  // hack to get around the jenkins api package
  var url = semester + '/' + job.project + '/' + encodeURIComponent(job.team);
  return url;
};

var getSonarURL = function(jenkinsJob, callback) {
  jenkins.api.job.get(jenkinsJob, {tree: 'builds[actions[url]]'}, function(err, sonar) {
    if (err) throw err;

    for (var i = 0; i < sonar.builds.length; i++) {
      var build = sonar.builds[i];
      if (build) {
        for (var j = 0; j < build.actions.length; j++) {
          var action = build.actions[j];
          if (action) {
            if (action.url) {
              return callback(err, action.url);
            }
          }
        }
      }
    }
    callback(err, '');
  });
};

exports.index = function(req, res) {
  res.json([]);
};

exports.job = function(req, res) {
  var jenkinsJob = buildAPIURL(req.semesterName, req.jobURL);
  jenkins.api.job.get(jenkinsJob, {tree: 'description,displayName,url,inQueue,buildable,color,healthReport[*],lastBuild[*],lastCompletedBuild[*],lastSuccessfulBuild[*],scm[userRemoteConfigs[url]]'}, function(err, data) {
    if (err || !data) {
      return res.status(404).json({msg: 'No project with that name.'});
    }

    var sshURL = data.scm.userRemoteConfigs[0].url;
    data.scm.github = "https://www.github.com/" + sshURL.substring(sshURL.indexOf(":") + 1, sshURL.lastIndexOf('.'));

    getSonarURL(jenkinsJob, function(err, sonar) {
      res.json({
        info: {semester: req.semesterName, job: req.jobURL},
        jenkins: data,
        sonarqube: sonar
      });
    });
  });
};

exports.metrics = function(req, res) {
  var jenkinsJob = buildAPIURL(req.semesterName, req.jobURL);
  jenkins.api.job.get(jenkinsJob, {tree: 'lastCompletedBuild[number],lastSuccessfulBuild[number]'}, function(err, data) {
    if (err || !data) {
      return res.status(404).json({msg: 'No project with that name.'});
    }
    var build = data.lastCompletedBuild.number;

    getSonarURL(jenkinsJob, function(err, sonar) {
      var sonarKey = sonar.substr(sonar.lastIndexOf('/') + 1);

        async.parallel({
          dry: function (callback) {
            jenkins.api.build.get(jenkinsJob, build + '/dryResult', function(err, data) {
              if (err) {
                data = {};// there is no metric information for this
              }
              data.trendGraph = req.originalUrl + '/dry';
              callback(null, data);
            });
          },
          sonarmetrics: function(callback) {
            sonarqube.metrics(sonarKey, function(err, data) {
              callback(null, data);
            });
          }
        }, function(err, results) {
          return res.json(results);
        });
    });
  });
};

exports.dryImage = function(req, res) {
  var jenkinsJob = buildAPIURL(req.semesterName, req.jobURL);
  jenkins.api.job.get(jenkinsJob, {tree: 'url'}, function(err, data) {
    if (err || !data) {
      return res.status(404).json({msg: 'No project with that name.'});
    }
    var url = jenkins.authenticateURL(data.url + 'dry/trendGraph/png');
    request.get(url).pipe(res);
  });
};

exports.issues = function(req, res) {
  var jenkinsJob = buildAPIURL(req.semesterName, req.jobURL);

  getSonarURL(jenkinsJob, function(err, sonar) {
    var sonarKey = sonar.substr(sonar.lastIndexOf('/') + 1);
    sonarqube.metrics(sonarKey, function(err, data) {

      callback(null, data);
    });
  });
};

exports.jobParse = function(req,res,next,job) {
  console.log('Job: ' + job);
  req.jobURL = jenkins.parseRepoName(job);
  next();
};

exports.semesterParse = function(req,res,next,semester) {
  if (semester === 'default') {
    semester = 'spring2015';
    req.semester = 'spring2015'
  }
  console.log('Sem: ' + semester);
  req.semesterName = jenkins.getSemester(semester);
  next();
};
