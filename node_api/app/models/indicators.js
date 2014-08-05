// app/models/indicators.js

var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var indicatorsSchema   = new Schema({
	name: String,
	units: String,
	indID: String
});

module.exports = mongoose.model('indicators', indicatorsSchema);