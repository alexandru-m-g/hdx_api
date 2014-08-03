// server.js

// BASE SETUP
// =============================================================================

// call the packages we need
var express    = require('express'); 		// call express
var app        = express(); 				// define our app using express
var bodyParser = require('body-parser');

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser());

var port = process.env.PORT || 8080; 		// set our port

// connecting to a local database
var mongoose   = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/gaza'); // connect to our database

// loading the shema models
var Indicator     = require('./app/models/indicators');
var Value     = require('./app/models/values');
var Dataset     = require('./app/models/datasets');


// ROUTES FOR OUR API
// =============================================================================
var router = express.Router(); 				// get an instance of the express Router

// middleware to use for all requests
router.use(function(req, res, next) {
	// do logging
	console.log('Something is happening.');
	next(); // make sure we go to the next routes and don't stop here
});

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
	res.json({ message: 'HDX API Prototype v.0.1 (Gaza) | @luiscape + @takaravasha' });	
});

// indicators route
router.route('/indicators')
	.get(function(req, res) {
		Indicator.find(function(err, indicators) {
			if (err)
				res.send(err);

			res.json(indicators);
		});
	});

// values route
router.route('/values')
	.get(function(req, res) {
		Value.find(function(err, values) {
			if (err)
				res.send(err);

			res.json(values);
		});
	});


// searching values based on indIDs
router.route('/values/:indID').get( function(req, res) {
  mongoose.model('values').find({indID: req.params.indID}, function(err, values) {
    mongoose.model('values').populate(values, {path: 'indicators'}, function(err, values) {
      res.send(values);
    });
  });
});

// datasets route
router.route('/datasets')
	.get(function(req, res) {
		Dataset.find(function(err, datasets) {
			if (err)
				res.send(err);

			res.json(datasets);
		});
	});



// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('=================================\n' +
	'=================================\n' +
	'==== Welcome to the HDX API =====\n' +
	'==== Version: Gaza (0.1) ========\n' +
	'=================================\n' +
	'=================================\n' +
	'Listening to port: ' + port);
 