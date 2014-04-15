var fs = require('fs');
var _ = require('lodash');

var config = JSON.parse(fs.readFileSync('./config.json', {
  encoding: 'utf8'
}));

// compilazione delle regexp dei trigger
_.forEach(config.triggers, function (t, tidx, array) {
  t.regexp = new RegExp(t.regexp_str);
});

exports.config = config;