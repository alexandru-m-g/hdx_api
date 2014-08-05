// app/models/locations.js

var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var locationsSchema   = new Schema({
	cps_pcode: String,
	country_iso_alpha_3_code: String,
	country_name: String,
	admin_level: Number,
	admin_level_name: String,
	place_name: String,
	pcode: Number
});

module.exports = mongoose.model('locations', locationsSchema);