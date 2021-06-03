var _ = require('lodash');

function formatName(name) {
  name = _.capitalize(name);
  name = name.split(" ");
  name = name[0];
  return name;
}

module.exports = { formatName };