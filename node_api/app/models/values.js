// app/models/indicators.js

var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var valuesSchema   = new Schema({
	dsID: String,
	region: String,
	indID: String,
	period: Number,
	value: Number,
	is_number: String,
	source: String
});

module.exports = mongoose.model('values', valuesSchema);