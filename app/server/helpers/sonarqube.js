var express = require('express');

var winston = require('./logger');
var verify = require('./verify');

var config = require('../config/sonarqube');

var request = require('request');

var sonarqube = function() {
  var api = request.defaults({
    baseUrl: config.sonarqube.server + '/api',
    auth : {
      user: config.sonarqube.username,
      password: config.sonarqube.password
    }
  });

  api.get('/languages/list', function(error, response, body) {
    console.log(body);
  });

  return {

  };
};

module.exports = sonarqube();

