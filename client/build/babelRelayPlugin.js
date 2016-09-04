var getbabelRelayPlugin = require('babel-relay-plugin');
var schema = require('../../xxicatalog/schema.json');

module.exports = getbabelRelayPlugin(schema.data);
