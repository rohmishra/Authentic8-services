const express = require( 'express' );
//const sql = require( 'sql' );
const twilioService = require( 'twilio' );
const twilio = new twilioService( process.env.twilio_accid, process.env.twilio_token );
const bodyParser = require( 'body-parser' );
const [ User, sms ] = require( './../services_model/db_service' );
//const PasswordManager = require( './../services_model/passwd_service' );
const session = require( 'express-session' );
var MongoStore = require( 'connect-mongo' )( session );
const router = express.Router();

// parse incoming requests
router.use( bodyParser.json() );
router.use( bodyParser.urlencoded( { extended: false } ) );

// Used by Authentic8 app or website to register user
// route: /service/register
// sample data:
//   email:rohan@email.com
//   username:gxmail
//   phone:989898988898
//   password:132he32iof4
router.route( '/register' )
  .post( ( req, res ) => {
    console.log( req.body + "\nREGISTERING NEW USER: " + req.body.email );
    let userData;
    if ( req.body.email &&
      req.body.username &&
      req.body.phone &&
      req.body.password ) {
      userData = {
        email: req.body.email,
        phone: req.body.phone,
        username: req.body.username,
        password: req.body.password
      }
      console.log( "All data available. created userData" );
    } else {
      console.log( "UNABLE TO PARSE DATA." )
      return res.status( 501 )
        .send( 'NOT ALL VALUES.' );
    }
    //use schema.create to insert data into the db
    if ( !userData ) {
      console.log( "userdata unavalable." )
    }
    User.create( userData, function ( err, user ) {
      if ( err ) {

        consoe.log( `user:` + user );
        console.log( 'error: not registered.' );
        return next( err )
      } else {
        console.log( 'registered.' );
        res.send( 'done' );
      }
    } );
  } );

// Used by Authentic8 client to request SMS.
router.route( '/sms' )
  .post( ( req, res ) => {
    // Get phone Number
    let clientOTP = req.body.OTP || null;
    let number = req.body.phone_number || null;

    console.log( "Phone number is " + number );

    // Check db if phone number is alread registered. if yes -> respond fail "Already registered."
    // if ( db.collection( 'otp_pool' )
    //   .find( { phone } ) ) {
    //smsVerificationSchema changes
    // }

    // Check last SMS time. if time<5m -> fail "Too many request."
    // create OTP.
    let OTP = Math.floor( 100000 + Math.random() * 900000 );

    //If no OTP sent.
    if ( !clientOTP && number != null ) {
      // Save to db with phone number.
      smsRequest = {
        phone: number,
        otp: OTP,
        timestamp: Date.now()
      }
      sms.create( smsRequest, e => {
        console.log( 'UNABLE TO ADD TO DB.' + e );

      } )

      // Send SMS using twilio.
      twilio.messages
        .create( {
          from: '+13526395469',
          to: number,
          body: OTP + ' is your OTP for Authentic8.'
        } )
        .then( message => {
          console.log( message.sid );
          res.semd( 'done' );
        } )
        .catch( e => {
          console.log( "error sending SMS. Error: " + e );
          res.send( 501, 'SMS SEND FAILED' );
        } );
      // Send SUCCESS or FAIL to client with message..
      res.send( 200, 'Done' );
    } else {
      res.send( 200, 'Not implemented' );
      //retrieve from DB.

      //Check if same.

      // send sessionID
    }
  } );

// used by Authentic8 client to create new session.
router.route( '/login' )
  .post( ( req, res ) => {
    // TODO: Add SMS Two-step.
    if ( req.body.email && req.body.password ) {
      User.authenticate( req.body.email, req.body.password, ( err, user ) => {
        if ( !user || err ) {
          res.status( 401 );
          return next( err );
        } else {
          // TODO: Use actual session ID instead of UID.
          req.session.sessionID = user._id;
          // send token to client.
        }
      } )
    } else {
      res.send( 'FAIL' ); // Send proper JSON result with error.
    }
  } )

// Used by authentic8 app to destroy a session.
router.route( '/logout' )
  .post( ( req, res ) => {
    // Validate user session and destroy it.
    res.send( 401, 'Not implemented' );
  } )

module.exports = router;
