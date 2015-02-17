var winston = require('winston');

var logger = function() {

    winston.emitErrs = true;

    var log = new winston.Logger({
       transports: [
           new winston.transports.Console({
               level: 'debug',
               handleExceptions: true,
               json: false,
               colorize: true
           })
       ]
    });

    return log;
};

module.exports = logger();
