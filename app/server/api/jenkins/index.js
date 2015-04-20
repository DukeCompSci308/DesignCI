'use strict';

var express = require('express');
var controller = require('./jenkins.controller');

var router = express.Router();

router.param('semester', controller.semesterParse);

router.param('job', controller.jobParse);

router.get('/', controller.index);

router.get('/semester/:semester/job/:job', controller.job);

router.get('/semester/:semester/job/:job/metrics', controller.metrics);

module.exports = router;
