'use strict';

var _ = require('lodash');

var jenkins = require('../../helpers/jenkins');

var buildAPIURL = function(semester, job) {
  var url = encodeURIComponent(semester) + '/' + encodeURIComponent(job.project) + '/' + encodeURIComponent(job.team);
  return url;
};

http://design.cs.duke.edu/job/Spring%202015/job/Voogasalad/job/RDatGV/api/

exports.index = function(req, res) {
  res.json([]);
};

exports.job = function(req, res) {
  var jenkinsJob = buildAPIURL(req.semesterName, req.jobURL);
  console.log(jenkinsJob);
  jenkins.api.job.exists(jenkinsJob, function(err, exists) {
    if (err) throw err;
    console.log('exists', exists);
  });

  res.json({semester: req.semesterName, job: req.jobURL});
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
