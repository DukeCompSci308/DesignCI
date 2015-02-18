var express = require('express');
var fs = require('fs-extra');
var winston = require('./logger');

var git = function(repo) {
    winston.info(repo.ssh_url);
    var repoInfo = repo;

    var cloneFolder = "/tmp/github/" + repo.full_name;
    fs.ensureDirSync(cloneFolder);
    winston.info('Folder: ' + cloneFolder);
    var simpleGit = require('simple-git')(cloneFolder);

    var cloneRepo = function(then) {
        simpleGit.clone(repo.ssh_url, 'repo', function(err) {
            then(err, cloneFolder);
        });
    };

    var deleteRepo = function() {
        fs.delete(cloneFolder, function(err) {
            if(err) {
                winston.error('Could not delete repository.');
            }
        });
    };

    return {
        git: simpleGit,
        clone: cloneRepo,
        delete: deleteRepo
    };
};

module.exports = git;
