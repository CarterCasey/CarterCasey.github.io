// The main file used for Marauder's Map database.
var bodyparser = require("body-parser");
var express = require("express");
var cheerio = require("cheerio");
var valid = require("validator");
// var geolib = require("geolib"); // Doesn't work...
var fs = require("fs");

var ENV = process.env;

function dbErr(err, res) {
	console.log(err);
	res.statusCode = 500;
	res.send("ERROR: Internal Database error.");
};

// Taken directly from geolib source code
// (included in node_modules)
// Modified to not give errors on whole numbers
function toBase60 (dec) {
	var tmp = dec.toFixed(20).split('.');

	var deg = Math.abs(tmp[0]);
	var min = ('0.' + tmp[1])*60;
	var sec = min.toFixed(20).split('.');

	min = Math.floor(min);
	sec = (('0.' + sec[1]) * 60).toFixed(2);

	return (deg + '° ' + min + "' " + sec + '"');
}

function toCoords (lat, lng) {
	var lat_str = toBase60(lat);
	var lng_str = toBase60(lng);

	if (lat < 0) { lat_str += " S"; } else { lat_str += " N"; }

	if (lng < 0) { lng_str += " W"; } else { lng_str += " E"; }

	return lat_str + ", " + lng_str;

}

var app = express();

// Set app middleware

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));

app.use(express.static(__dirname + '/public'));

/********************* DATABASE SETUP ***********************/

var mongo_uri = ENV.MONGOLAB_URI || ENV.MONGOHQ_URL
			 || "mongodb://localhost/mmap-mongo";
var MongoClient = require("mongodb").MongoClient;

var db; MongoClient.connect(mongo_uri, function (err, conn) {
	if (!err) {
		db = conn;
	} else {
		console.log(err);
	}
});

app.all("*", function (req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "X-Requested-With");
	next();
});

/********************** POST API ************************/

app.post("/sendLocation", function (req, res) {
	var params = req.body;
	var login = params.login; var lat = params.lat; var lng = params.lng;

	if (!login || !lat || !lng || !valid.isFloat(lat) || !valid.isFloat(lng)) {
		res.statusCode = 400;
		var error = {"error": "Whoops, something is wrong with your data!"};
		res.send(JSON.stringify(error));
	} else {
		var user = {
			login: params.login, // valid.escape(params.login),
			lat: parseFloat(params.lat),
			lng: parseFloat(params.lng),
			created_at: (new Date()).toISOString()
		};

		db.collection("user_locations", function (err, user_locations) {
			if (err) {
				dbErr(err, res);
			} else {
				user_locations.update({"login": user.login}, user, {upsert: true},
				function (err, saved) {
					if (err) {
						dbErr(err, res);
					} else {
						user_locations.find().toArray(function (err, docs) {
							if (err) {
								dbErr(err, res);
							} else {
								res.send(docs);
							}
						});
					}
				});
			}
		});
	}
});

/********************** LOCATION API ************************/

app.get("/location.json", function (req, res) {
	if (!req.query.login) {
		res.statusCode = 400;
		res.send("{}");
	} else {
		var login = req.query.login; // valid.escape(req.query.login);
		db.collection("user_locations", function (err, user_locations) {
			if (err) {
				dbErr(err, res);
			} else {
				user_locations.findOne({"login": login},
					function (err, found) {
						res.send(found || "{}");
					}
				);
			}
		});
	}
});

/********************** INDEX API ************************/

app.get("/", function (req, res) {
	db.collection("user_locations", function (err, user_locations) {
		if (err) {
			dbErr(err, res);
		} else {
			user_locations.find().toArray(function (err, docs) {
				if (err) {
					dbErr(err, res);
				} else {
					docs.sort(function (a, b) {
						var a_epoch = (new Date(a.created_at)).valueOf();
						var b_epoch = (new Date(b.created_at)).valueOf();
						return b_epoch - a_epoch;
					});
					fs.readFile(__dirname + "/index.html", function (err, html) {
						if (err) {
							console.log(err);
						} else {
							var index = cheerio.load(html);

							for (i in docs) {
								var created_time = new Date(docs[i].created_at);
								var log = "\n\t<li>" + docs[i].login
										+ " checked in on "
										+ created_time.toDateString() + ", "
										+ created_time.toTimeString() + ", at "
										+ toCoords(docs[i].lat, docs[i].lng)
										+ ".</li>";
								index("#check-ins ul").append(log);
							}
							index("#check-ins ul").append("\n");
							res.send(index.html());
						}
					});
				}
			});
		}
	});
});

app.listen(ENV.PORT || 8000);

