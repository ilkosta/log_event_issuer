var config = require('./config').config;
var Redmine = require('redmine');

var createIssue;
var fake = config.redmine.use_fake || false;

if (!fake) {

  var redmine = new Redmine({
    host: config.redmine.host,
    apiKey: config.redmine.apiKey
  });

  createIssue = function (matchedTrigger, data) {

    var issue = {
      project_id: config.redmine.issue_data.project_id,
      subject: '' + config.redmine.issue_data.subject_prefix + matchedTrigger.description,
      assigned_to_id: (matchedTrigger.assigned_to && matchedTrigger.assigned_to.id) ? matchedTrigger.assigned_to.id : null,
      tracker_id: config.redmine.issue_data.tracker_id,
      description: data
    };

    redmine.postIssue(issue, function (err, data) {
      if (err) {
        console.log('Error: ' + err.message);
        return;
      }
    });
  };
} else {

  console.log('starting in fake mode!');

  createIssue = function (matchedTrigger, data) {
    console.log(data);
    console.log('----------------------')
  };
}

exports.createIssue = createIssue;