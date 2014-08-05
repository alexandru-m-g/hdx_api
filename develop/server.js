#!/bin/env node

// BASE SETUP
// =============================================================================

// call the packages we need
var express    = require('express'); 		// call express
var app        = express(); 				// define our app using express
var bodyParser = require('body-parser');
var fs         = require('fs');
var url        = require('url');
var restify    = require('restify');


// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser());
// app.use(restify.queryParser());

var port = process.env.PORT || 8080; 		// set our port

// connecting to a local database
var mongoose   = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/gaza'); // connect to our database

// loading the shema models
var Indicator     = require('./models/indicators');
var Value     = require('./models/values');
var Dataset     = require('./models/datasets');
var Location     = require('./models/locations');


// ROUTES FOR OUR API
// =============================================================================
var router = express.Router(); 				// get an instance of the express Router

// middleware to use for all requests
router.use(function(req, res, next) {
	// do logging
	console.log("I'm being poked.");
	next(); // make sure we go to the next routes and don't stop here
});

// configuring handling of parameters
app.param('region', function(req, res, next, region) {
  // typically we might sanity check that user_id is of the right format
  Value.find(region, function(err, user) {
    if (err) return next(err);

    req.region = region;
    next()
  });
});

// ADDING BASIC VIEWS
router.get("/", function(req, res) {
  res.sendfile("views/index.html");
});

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/api', function(req, res) {
	res.json({
		message: 'HDX API Prototype',
		version_name: 'Gaza',
		version: 0.1,
		author: '@luiscape + @takaravasha',
		repository: 'https://github.com/luiscape/hdx_api'
	});
});

// indicators routes
router.route('/api/indicators').get(function(req, res) {
		Indicator.find(function(err, indicators) {
			if (err)
				res.send(err);

			if (req.param("indID")) {
				mongoose.model('indicators').find({ indID: req.param("indID") }, function(err, indicators) {
	      			res.send(indicators);
				});
			}
			else if (req.param("units")) {
				mongoose.model('indicators').find({ units: req.param("units") }, function(err, indicators) {
	      			res.send(indicators);
				});
			}

			else res.json(indicators);
		});
	});


// searching values based on indIDs
router.route('/api/values').get(function(req, res) {
		Indicator.find(function(err, values) {
			if (err)
				res.send(err);

			if (req.param("region")) {
				mongoose.model('values').find({ region: req.param("region") }, function(err, values, next) {
	      			res.send(values);
				});
			}

			else if (req.param("period")) {
				mongoose.model('values').find({ period: req.param("period") }, function(err, values) {
	      			res.send(values);
				});
			}

			else res.json( { message: 'Select at least one indicator.', indID: values } );

		});
	});


// searching values based on indIDs
// router.route('/api/values/:indID').get( function(req, res) {
//  mongoose.model('values').find({indID: req.params.indID}, function(err, values) {
//    mongoose.model('values').populate(values, {path: 'indicators'}, function(err, values) {

//      res.send(values);
//    });
//  });
//});

// datasets general route
router.route('/api/datasets')
	.get(function(req, res) {
		Dataset.find(function(err, datasets) {
			if (err)
				res.send(err);

			res.json(datasets);
		});
	});

// locations general route
router.route('/api/locations')
	.get(function(req, res) {
		Location.find(function(err, locations) {
			if (err)
				res.send(err);

			if (req.param("admin_level")) {
				mongoose.model('locations').find({ admin_level: req.param("admin_level") }, function(err, values, next) {
					Location.count({ admin_level: req.param("admin_level") }, function (err, total) {
					  if (err) console.log("you've got an error counting my friend");
					  else res.json({
					  	help: "Here you find a list of locations managed by HDX.",
					  	count: total,
					  	locations: values
					  });
					})
				});
			}

			else {
				Location.count({ }, function (err, total) {
				  if (err) console.log("you've got an error counting my friend");
				  else res.json({ count: total, locations: locations });
				})
			}
		});
	});


// Defining the faceting function
var url_parts = url.parse("/api/indicators", true);
var query = url_parts.query;


// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('         _       _         _           _      _       \n' +
			'        / /\    / /\      /\ \       /_/\    /\ \     \n' +
			'       / / /   / / /     /  \ \____  \ \ \   \ \_\    \n' +
			'      / /_/   / / /     / /\ \_____\  \ \ \__/ / /    \n' +
			'     / /\ \__/ / /     / / /\/___  /   \ \__ \/_/     \n' +
			'    / /\ \___\/ /     / / /   / / /     \/_/\__/\     \n' +
			'   / / /\/___/ /     / / /   / / /       _/\/__\ \    \n' +
			'  / / /   / / /     / / /   / / /       / _/_/\ \ \   \n' +
			' / / /   / / /      \ \ \__/ / /       / / /   \ \ \  \n' +
			'/ / /   / / /        \ \___\/ /       / / /    /_/ /  \n' +
			'\/_/    \/_/          \/_____/        \/_/     \_\/   \n' +
			'=================================\n' +
			'==== Welcome to the HDX API =====\n' +
			'==== Version: Gaza (0.1) ========\n' +
			'=================================\n' +
			'=================================\n' +
			'Listening to port: ' + port);