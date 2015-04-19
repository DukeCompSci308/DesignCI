'use strict';

var express = require('express');
var controller = require('./jenkins.controller');

var router = express.Router();

router.param('semester', controller.semesterParse);

router.param('job', controller.jobParse);

router.get('/', controller.index);

router.get('/:semester/:job', controller.job);

router.get('/:job', function(req, res) {
  res.redirect('spring2015/' + req.params.job);
});

module.exports = router;
