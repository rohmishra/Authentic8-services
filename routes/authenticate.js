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

        console.log( `user:` + user || null );
        console.log( 'error: not registered. Reason ' + err );
        res.status( 409 )
          .send( `error. not registered.` )
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
    let clientOTP = req.body.phone_OTP || null;
    let number = req.body.phone_number || null;

    console.log( "Phone number is " + number );

    // Check db if phone number is alread registered. if yes -> respond fail "Already registered."
    // if ( db.collection( 'otp_pool' )
    //   .find( { phone } ) ) {
    //smsVerificationSchema changes
    // }

    // Check last SMS time. if time<5m -> fail "Too many request."
    // create OTP.

    //If no OTP sent.
    if ( !clientOTP && number != null ) {
      let OTP = Math.floor( 100000 + Math.random() * 900000 );
      // Save to db with phone number.
      smsRequest = {
        phone: number,
        otp: OTP,
        timestamp: Date.now()
      }
      sms.create( smsRequest, ( err, sms ) => {
        if ( err ) {
          console.log( 'UNABLE TO ADD TO DB.' + e );
        } else {
          console.log( sms );
        }
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
          res.send( 'done' );
        } )
        .catch( e => {
          console.log( "error sending SMS. Error: " + e );
          res.send( 501, 'SMS SEND FAILED' );
        } )
        .then( _ => { res.send( "Done" ); } );
      // Send SUCCESS or FAIL to client with message..
    } else {
      console.log( clientOTP );
      sms.findOne( { phone: number } )
        .exec( ( err, code ) => {
          if ( err ) {
            res.status( 501 )
              .json( { "message": "Error occured" } );
          } else {
            if ( !code ) {
              res.status( 401 )
                .json( { "message": "Not found" } )
            } else {
              if ( code.OTP == clientOTP ) {
                res.send( 200, 'SUCCESS' );
              } else {
                res.send( 201, 'FAIL' );
              }
            }
          }
        } )
      let OTP = 0000; //

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
        console.log( `email: ` + req.body.email + ` password: ` + req.body.password );
        if ( err ) {
          res.status( 404 )
            .send( 'error somewhere.' );
        }
        if ( !user ) {
          res.status( 401 )
            .send( 'error, cant find user.' );
        } else if ( user == `pasword mismatch.` ) {
          res.status( 407 )
            .send( 'pasword mismatch.' );
        } else {
          // TODO: Use actual session ID instead of UID.
          req.session.sessionID = user._id;
          res.status( 200 )
            .send( `done. Accepted.` );
          // send token to client.
        }
      } )
    } else {
      res.status( 404 )
        .send( 'FAIL' ); // Send proper JSON result with error.
    }
  } )

// Used by authentic8 app to destroy a session.
router.route( '/logout' )
  .post( ( req, res ) => {
    // Validate user session and destroy it.
    res.send( 401, 'Not implemented' );
  } )

module.exports = router;
