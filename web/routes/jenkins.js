var express = require('express');
var router = express.Router();

var jenkins = require('../helpers/jenkins');

/* GET home page. */

router.get('/', function(req, res) {
  jenkins.getJobs(function(err, data) {
    res.json(data);
  });
});

module.exports = router;
