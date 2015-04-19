'use strict';

var _ = require('lodash');

var jenkins = require('../../helpers/jenkins');


// Get list of jenkinss
exports.index = function(req, res) {
  res.json([]);
};
