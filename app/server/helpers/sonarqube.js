var express = require('express');

var winston = require('./logger');
var verify = require('./verify');

var config = require('../config/sonarqube');

var request = require('request');

var sonarqube = function() {
  var api = request.defaults({
    baseUrl: "http://" + config.sonarqube.server + '/api',
    auth : {
      user: config.sonarqube.username,
      password: config.sonarqube.password
    },
    headers: [
      {
        name: 'content-type',
        value: 'application/json'
      }
    ]
  });

  /* Important endpoints:
      - api/issues/search
      - api/resources/index
   */

  // http://design.cs.duke.edu/sonar/api/resources/index?resource=duke-compsci308-spring2015.voogasalad_ScrollingDeep:voogasalad_ScrollingDeep&metrics=class_complexity,function_complexity,public_documented_api_density,violations,blocker_violations,critical_violations,ncloc,accessors,public_api




  return {
    metrics: function(project, callback) {
      api.get(
        {
          url: '/resources/index',
          qs: {
            resource: project,
            metrics: 'class_complexity,function_complexity,public_documented_api_density,violations,blocker_violations,critical_violations,major_violations,ncloc,accessors,public_api'
          }
      },
        function(error, response, body) {
          // let's parse this info coz it sucks
          if (error) {
            return callback(error, {});
          }
          var parsed = JSON.parse(body);
          // get the first result
          parsed = parsed[0];

          metricsData = {};


          if (parsed.hasOwnProperty('msr')) {
            for (var prop in parsed.msr) {
              var info = parsed.msr[prop];
              metricsData[info.key] = { value: info.val, formattedValue: info.frmt_val };
            }
          }

          parsed.metrics = metricsData;

          return callback(error, parsed);
      });
    },
    issues: function(project, callback) {
      //projectKeys=duke-compsci308-spring2015.voogasalad_ScrollingDeep:voogasalad_ScrollingDeep&severities=BLOCKER,CRITICAL, MAJOR&statuses=OPEN,CONFIRMED&s=SEVERITY&asc=false
      api.get(
        {
          url: '/issues/search',
          qs: {
            projectKeys: project,
            severities: 'BLOCKER,CRITICAL,MAJOR',
            statuses: 'OPEN,CONFIRMED',
            s: 'SEVERITY',
            asc: 'false'
          }
        },
        function(error, response, body) {
          if (error) {
            return callback(error, {});
          }
          var parsed = JSON.parse(body);
          delete parsed.components;


          metricsData = {};


          if (parsed.hasOwnProperty('msr')) {
            for (var prop in parsed.msr) {
              var info = parsed.msr[prop];
              metricsData[info.key] = { value: info.val, formattedValue: info.frmt_val };
            }
          }

          parsed.metrics = metricsData;

          return callback(error, parsed);
        });


    },
    test: function() {
      api.get('/languages/list', function(error, response, body) {
        if (error) {
        }
        console.log(body);
        console.log(response);
        console.log(error);
      });
    }
  };
};

module.exports = sonarqube();

