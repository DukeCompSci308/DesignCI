var express = require('express');
var router = express.Router();
var winston = require('winston');

var github_helper = require('../helpers/github');

/* GET home page. */

router.get('/', function(req, res) {
  res.render('index', { title: 'GitHub Web Hooks' });
});

router.post('/webhook', function(req, res){
    var event = req.header('X-Github-Event');

    var signature = req.header('X-Github-Signature');
    // verify this?

    var deliveryID = req.header('X-Github-Delivery');

    winston.info('New event from Github: ' + event);

    github_helper.handleEvent(event, req.body);

    res.status(200).json({ message: 'Thanks!'});
});

module.exports = router;
