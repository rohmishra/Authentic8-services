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
