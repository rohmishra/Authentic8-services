const express = require( 'express' );
const authenticate = require( './routes/authenticate' );
const AppManager = require( './routes/app_manage' );
const dotenv = require( 'dotenv' );
const bodyParser = require( 'body-parser' );
const mongoose = require( 'mongoose' );
const session = require( 'express-session' );

//** Startup **
// init express, load env vars.
const app = express()
dotenv.load();
//connect to db
mongoose.connect( process.env.MONGODB_URI );
const db = mongoose.connection;

//handle mongo error
db.on( 'error', console.error.bind( console, 'connection error:' ) );
db.once( 'open', function () {
  // Connected to database.
  console.log( 'connected to db.' );
} );

app.use( session( {
  resave: true,
  secret: 'neverusethisecretagain',
  saveUninitialized: true
} ) );

app.use( '/service', authenticate )
app.use( '/api', AppManager )

// error handler
app.use( ( req, res, next ) => {
  var err = new Error( 'File Not Found' );
  err.status = 404;
  next( err );
} );

// define as the last app.use callback
app.use( ( err, req, res, next ) => {
  res.status( err.status || 500 );
  res.send( err.message );
} );


// listen
app.listen( ( process.env.PORT || 3000 ), _ => {
  console.log( 'Setting up add on port ' + ( process.env.PORT || 3000 ) );
} );
