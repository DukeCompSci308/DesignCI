var express = require('express');

var winston = require('./logger');
var verify = require('./verify');
var fs = require('fs-extra');
var replace = require('replace');

var maven = function() {

    var replaceConfigVariables = function(file, old, value) {
        winston.info('file: ' + file);
        winston.info('old: ' + old);
        winston.info('value: ' + value);
        replace({
            regex: old,
            replacement: value,
            paths: [file]
        });
    };

    var createConfig = function(repo, folder, then) {
        var pomFile = "scripts/pom.xml";
        var destFile = folder + '/repo/pom.xml';

        fs.copy(pomFile, destFile, function(err) {
            if (err) winston.error(err);
            replaceConfigVariables(destFile, '{ORGANIZATION}', repo.owner.login);
            replaceConfigVariables(destFile, '{REPO}', repo.name);

            winston.info('Created Maven pom file.');
            then();
        });
    };

    return {
        config : createConfig
    }
};

module.exports = maven();
