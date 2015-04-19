'use strict';

var _ = require('lodash');

var jenkins = require('../../helpers/jenkins');

var buildAPIURL = function(semester, job) {
  // hack to get around the jenkins api package
  var url = semester + '/' + job.project + '/' + encodeURIComponent(job.team);
  return url;
};

exports.index = function(req, res) {
  res.json([]);
};

exports.job = function(req, res) {
  var jenkinsJob = buildAPIURL(req.semesterName, req.jobURL);
  console.log(jenkinsJob);
  jenkins.api.job.exists(jenkinsJob, function(err, exists) {
    if (err || !exists) {
      res.status(404).json({msg: 'No job with that name.'});
    }
    res.json({semester: req.semesterName, job: req.jobURL});
  });
};

exports.jobParse = function(req,res,next,job) {
  console.log('Job: ' + job);
  req.jobURL = jenkins.parseRepoName(job);
  next();
};

exports.semesterParse = function(req,res,next,semester) {
  console.log('Sem: ' + semester);
  req.semesterName = jenkins.getSemester(semester);
  next();
};
