// app/models/indicators.js

var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var valuesSchema   = new Schema({
	value: String
});

module.exports = mongoose.model('values', valuesSchema);