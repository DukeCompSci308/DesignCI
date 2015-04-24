'use strict';

var express = require('express');
var controller = require('./jenkins.controller');

var router = express.Router();

router.param('semester', controller.semesterParse);

router.param('job', controller.jobParse);

router.get('/', controller.index);

router.get('/semester/:semester/project/:job', controller.job);

router.get('/semester/:semester/project/:job/metrics', controller.metrics);

router.get('/semester/:semester/project/:job/metrics/dry', controller.dryImage);

module.exports = router;
