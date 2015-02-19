var express = require('express');

var winston = require('./logger');
var maven = require('./maven');
var verify = require('./verify');

var jenkins = require('./jenkins');

var github = function() {
    var handleEvent  = function(event, data) {
        // Handle the events we care about - https://developer.github.com/v3/activity/events/types
        switch (event) {
            case 'repository':
                repositoryEvent(data);
                break;
            case 'commit_comment':
            case 'fork':
            case 'pull_request':
                break;
        }

    };

    /**
     * Occurs when an event occurs on a repository. Currently only a create event.
     * @param data The data that was sent for the event.
     */
    var repositoryEvent = function (data) {
        if (data.action === "created") {
            winston.info("New repo created: " + data.repository.name);
            winston.info("Organization: " + data.organization.login);
            if (!verify.organizationName(data.organization.login)) {
                winston.warn('This organization is not part of Duke.');
                return;
            }
            winston.info('Valid organization and repo.');
            winston.info('Setting up repo for CI tools.');
            var gitHelper = require('./git')(data.repository);
            var git = gitHelper.git;
            gitHelper.clone(function(err, cloneFolder) {
                maven.config(data.repository, cloneFolder, function() {
                    winston.info('pom file configured and placed in repo.');
                    git.add('pom.xml', function(err) {
                        if (err) winston.error(err);
                        git.commit('Setup maven pom.xml file.', function(err) {
                            if (err) { /* most likely pom file exists. */ }
                            git.push(function(err) {
                                if (err) winston.error(err);
                                winston.info('Added pom file, committed, and pushed.');
                                gitHelper.delete();
                                winston.info('Deleted repository.');

                                // now we want to go and create the job on Jenkins
                                jenkins.createJob(data.repository);
                            });
                        });
                    });
                });

            });
            winston.info('Cloned Repo');
        }
    };

    return {
        handleEvent: handleEvent
    }
};

module.exports = github();
