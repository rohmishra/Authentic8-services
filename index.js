const express = require( 'express' );
const twilio = require( 'twilio' );
const authenticate = require( './routes/authenticate' );
const dotenv = require( 'dotenv' );
const bodyParser = require( 'body-parser' );
const mongoose = require( 'mongoose' );
const session = require( 'express-session' );

//** Startup **
const app = express()
dotenv.load();
//connect to db
mongoose.connect( `mongodb://{{process.env.testuser}}:{{process.env.testpassword}}@ds161306.mlab.com:61306/heroku_ftdhl2km` );
const db = mongoose.connection;

//handle mongo error
db.on( 'error', console.error.bind( console, 'connection error:' ) );
db.once( 'open', function () {
  // Connected to database.
  console.log( 'connected' );
} );


app.use( '/api', authenticate )

app.use( ( req, res, next ) => {
  var err = new Error( 'File Not Found' );
  err.status = 404;
  next( err );
} );

// error handler
// define as the last app.use callback
app.use( f( err, req, res, next ) => {
  res.status( err.status || 500 );
  res.send( err.message );
} );


// listen on port 3000
app.listen( 443, _ => {
  console.log( 'Express app listening on port 3000' );
} );
