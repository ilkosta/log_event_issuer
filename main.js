var spawn = require('child_process').spawn;

var _ = require('lodash');

var config = require('./config').config;
var createIssue = require('./redmine_issuer').createIssue;


_.forEach(config.log_files, function (logFileName, lfn_idx, array) {
  var tail = spawn(
    config.log_reader.cmd,
    config.log_reader.parameters.concat([logFileName]),
    config.log_reader.options);


  var firstRun = true;
  tail.stdout.setEncoding('utf8');
  tail.stdout.on('data', function (logMsgs) {
    if (firstRun) {
      firstRun = false;
      return;
    }

    // se una regexp viene matchata
    // viene creato l'issue su redmine
    // e non viene fatto il controllo per le regexp successive
    _.forEach(config.triggers, function (t, tidx, array) {
      var matches = t.regexp.exec(logMsgs);
      if (matches && matches.length > 0) {
        createIssue(t, logMsgs);
        return false; // break
      }
      return true;
    });

  });
});