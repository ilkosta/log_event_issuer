//var spawn = require('child_process').spawn;
var _ = require('lodash');

var config = require('./config').config;
var createIssue = require('./redmine_issuer').createIssue;


var checkTriggerConditions = function (logMsgs) {
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
};


var tail;
var Tail = require('tail').Tail,
  spawn = require('child_process').spawn;

var watch = function (logFileName) {
  if (config.log_reader.js_tail) {

    tail = new Tail(logFileName);
    tail.on('line', checkTriggerConditions);
    tail.watch();

  } else {
    tail = spawn(
      config.log_reader.cmd,
      config.log_reader.parameters.concat([logFileName]),
      config.log_reader.options);


    // don't run the trigger at the first run
    var fakeCheck = function (logMsgs) {
      checkDataFn = checkTriggerConditions;
    };
    var checkDataFn = fakeCheck;

    tail.stdout.setEncoding('utf8');
    tail.stdout.on('data', function (logMsgs) {
      checkDataFn(logMsgs);
    });
  }
};


_.forEach(config.log_files, watch);