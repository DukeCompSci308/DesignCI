'use strict';

var _ = require('lodash');

var jenkins = require('../../helpers/jenkins');

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

    jenkins.api.build.get(jenkinsJob, build + '/dryResult', function(err, data) {
      if (err) {
        data = {};// there is no metric information for this
      }
      return res.json({dry: data});
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
