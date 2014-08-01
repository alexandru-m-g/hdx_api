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

// setup the database.
// in this case we are using a standard one.
// add a new MongoDB database. Hosted on the web somewhere.
// what is the 'mongoose' library.
var mongoose   = require('mongoose');
// mongoose.connect('mongodb://node:node@novus.modulusmongo.net:27017/Iganiq8o');  // tutorial database
mongoose.connect('mongodb://127.2.196.2:27017/gaza');  // openshift database

// adding the db schema
// change the schema names: hdx_schema
// change the variable names that will be used later
var Bear     = require('./app/models/bear');


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
	res.json({
		message: 'Welcome to the HDX API. Version: Gaza v.0.1'
	});
});


// on routes that end in /bears
// change to /indicators -- the first route + table that should be implemented.
// ----------------------------------------------------
router.route('/bears')

	// create a bear (accessed at POST http://localhost:8080/api/bears)
	// create an indicator: not necessary but worth to continue following the example.
	// **eliminate when done**
	.post(function(req, res) {

		var bear = new Bear(); 		// create a new instance of the Bear model
		bear.name = req.body.name;  // set the bears name (comes from the request)

		// save the bear and check for errors
		bear.save(function(err) {
			if (err)
				res.send(err);

			res.json({ message: 'Indicator created!' });
		})

		// get all the bears (accessed at GET http://localhost:8080/api/bears)
		.get(function(req, res) {
			Bear.find(function(err, bears) {
				if (err)
					res.send(err);

				res.json(bears);
			});
		});

	});

// on routes that end in /bears/:bear_id
// routes that try to fetch an indicator by its indID
// ----------------------------------------------------
router.route('/bears/:bear_id')  // change to use indID

	// get the bear with that id (accessed at GET http://localhost:8080/api/bears/:bear_id)
	.get(function(req, res) {
		Bear.findById(req.params.bear_id, function(err, bear) {
			if (err)
				res.send(err);
			res.json(bear);
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