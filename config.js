var fs = require('fs');
var _ = require('lodash');

var config = JSON.parse(fs.readFileSync('./config.json', {
  encoding: 'utf8'
}));

// compilazione delle regexp dei trigger
_.forEach(config.triggers, function (t, tidx, array) {
  t.regexp = new RegExp(t.regexp_str,'i');
  if(t.ignore)
    t.ignore_re = _.map(t.ignore, function(restr) {
      return new RegExp(restr);
    });
});

exports.config = config;