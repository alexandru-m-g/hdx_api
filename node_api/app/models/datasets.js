// app/models/indicators.js

var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var datasetsSchemas   = new Schema({
	name: String
});

module.exports = mongoose.model('datasets', datasetsSchemas);