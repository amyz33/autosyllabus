//MAIN DATABASE SETUP
var db = null,
dbDetails = new Object();
var  fs = require('fs'),
eps     = require('ejs'),
morgan  = require('morgan');
Object.assign=require('object-assign');

var setupMongoDB = function(){
//try to connect to database, if you cant, print error message
initDb(function(err){console.log("Error: Unable to connect to database. Message: "+err)});
console.log("called setupMongoDB");
};



var get = function(onyen, collection, callback){
	console.log(onyen);
  	//If the database connection isn't established, attempt to establish it.
	  if (!db) {
	  	initDb(function(err){});
	  } else  {
	  	var col = db.collection(collection);
	    //The findOne methods expects that you will only retrieve one result of the database. 
	    col.findOne({
	    	"_id":onyen
	    }, function(err, docs){

	    	console.log(docs);
	              //This sends the retrieved JSON back to the callback.  
	              callback(docs);

	          });
	}
};

//This 'save' method allows insertion of documents into mongoDB
var save = function(json, collection){
	console.log("saving: +  collection: "+ collection);
	if (!db) {
		initDb(function(err){});
	}
	if (db) {
		var col = db.collection(collection);
  //The save method here uses the mongoDB API to save. 
  col.save(json);
  col.count(function(err, count ){
  	if(err){
  		console.log("Insert error: "+ err);
  	}
  	console.log(JSON.stringify(json) + "was saved in " + collection);

  }); 
}

};

//This code retrieves the environment variables that are setup by our cloud apps instance. 
var port = process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 8080,
ip   = process.env.IP   || process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0',
mongoURL = process.env.OPENSHIFT_MONGODB_DB_URL || process.env.MONGO_URL,
mongoURLLabel = "";
console.log("Connecting to database...");

//db init start
var initDb = function(callback) {


	console.log("DB Name: " + process.env.DATABASE_SERVICE_NAME);
	console.log("MongoURL: " + mongoURL);

//This below if statement will only run if deployed on deployment server, (e.g. Carolina Cloud Apps)
if (mongoURL == null && process.env.DATABASE_SERVICE_NAME) {
	var mongoServiceName = process.env.DATABASE_SERVICE_NAME.toUpperCase(),
	mongoHost = process.env[mongoServiceName + '_SERVICE_HOST'],
	mongoPort = process.env[mongoServiceName + '_SERVICE_PORT'],
	mongoDatabase = process.env[mongoServiceName + '_DATABASE'],
	mongoPassword = process.env[mongoServiceName + '_PASSWORD'],
	mongoUser = process.env[mongoServiceName + '_USER'];

	console.log("Host: " + mongoHost);
	console.log("Port: " + mongoPort);
	console.log("Database: " + mongoDatabase);
	console.log("Usr: " + mongoUser);
	if (mongoHost && mongoPort && mongoDatabase) {
		mongoURLLabel = mongoURL = 'mongodb://';
		if (mongoUser && mongoPassword) {
			mongoURL += mongoUser + ':' + mongoPassword + '@';
		}
    //constructs connection url
    mongoURLLabel += mongoHost + ':' + mongoPort + '/' + mongoDatabase;
    mongoURL += mongoHost + ':' +  mongoPort + '/' + mongoDatabase;
    console.log("Should connect at: "+ mongoURL);
}
  //The below 'else if' will only run on your local machine 
  //- for local dev environment
} else if (process.env.DATABASE_SERVICE_NAME == null && mongoURL == null){
	var mongoServiceName = "MONGODB",
	mongoHost = "127.0.0.1",
	mongoPort = "27017",
	mongoDatabase = "sampledb",
 mongoPassword ="password", //This a terrible password, but this is only used when running the environment locally
 mongoUser ="sampledb";

 mongoURL = 'mongodb://';
 mongoURL += mongoUser + ':' + mongoPassword + '@';
 mongoURL += mongoHost + ':' +  mongoPort + '/' + mongoDatabase;
    //URL for mongoDB looks like     mongodb://USERNAME:PASSWORD@DBHOST:DBPORT/DBNAME
}

if (mongoURL == null){
	console.log("error on db init. mongoURL: "+mongoURL);
	return;
} 

var mongodb = require('mongodb');
if (mongodb == null) return;

mongodb.connect(mongoURL, function(err, conn) {
	console.log("Attempting connection at: "+ mongoURL);
	if (err) {
		console.log("Database connection FAILED!");
		callback(err);
		return;
	}
	db = conn;
	dbDetails.databaseName = db.databaseName;
	dbDetails.url = mongoURLLabel;
	dbDetails.type = 'MongoDB';
	console.log('Connected to MongoDB at: %s', mongoURL);
});
};


//the below methods are accessible given a require statement in another .js file
module.exports = {
	setupMongoDB: setupMongoDB,
	save: save,
	get : get
};