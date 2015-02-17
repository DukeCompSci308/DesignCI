var express = require('express');
var winston = require('./logger');

var verify = function() {

    return {
        /**
         * Verifies that an organization is part of Duke.
         * @param name
         */
        organizationName: function(name) {
            return name.indexOf('duke') >= 0 || name === 'baxterandthehackers';
        }
    }
};

module.exports = verify();
