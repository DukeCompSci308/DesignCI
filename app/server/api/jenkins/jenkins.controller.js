'use strict';

var _ = require('lodash');

var jenkins = require('../../helpers/jenkins');

exports.index = function(req, res) {
  res.json([]);
};

exports.job = function(req, res) {
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
