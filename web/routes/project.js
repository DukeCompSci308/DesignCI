var express = require('express');
var router = express.Router();

/* GET home page. */

router.get('/', function(req, res) {
  res.render('project', { title: 'Duke Design', user: { name: 'Tadimsky'} });
});

router.get('/demo', function(req, res) {
  res.render('project',
      {
        title: 'SLOGO Team 03',
        user:
        {
          name: 'Tadimsky'
        },
        project: {
          url: 'http://design.cs.duke.edu/job/Fall%202014/job/Slogo/job/Team%2003/',
          github: 'https://github.com/duke-compsci308-spring2015/slogo_team03',
          building: false,
          health: {
            description: "Build stability: No recent builds failed.",
            score: 100
          },
          lastBuild: {
            number: 3,
            url: "http://design.cs.duke.edu/job/Fall%202014/job/Slogo/job/Team%2003/3/"
          },
          lastSuccessfulBuild: {
            number: 3,
            url: "http://design.cs.duke.edu/job/Fall%202014/job/Slogo/job/Team%2003/3/"
          }
        }
      });
});

module.exports = router;
