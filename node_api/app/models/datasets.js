// app/models/indicators.js

var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var datasetsSchemas   = new Schema({
	dsID: String,
	last_updated: String,
    last_scraped: String,
	name: String
});

module.exports = mongoose.model('datasets', datasetsSchemas);