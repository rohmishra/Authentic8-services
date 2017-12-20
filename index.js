const express = require( 'express' );
const twilio = require( 'twilio' );
const authenticate = require( './routes/authenticate' );


//** Startup **
const app = express()

app.use( '/api', authenticate )
