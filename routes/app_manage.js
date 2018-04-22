const express = require( 'express' );
//const sql = require( 'sql' );
const bodyParser = require( 'body-parser' );
const User = require( './../services_model/db_service' );
const App = require( './../services_model/app_service' );
//const PasswordManager = require( './../services_model/passwd_service' );
const session = require( 'express-session' );
var MongoStore = require( 'connect-mongo' )( session );
const router = express.Router();

// Used by Authentic8 client to control app access
// requires: user session, app token, alow/deny response
router.route( '/init' )
  .post( ( req, res ) => {
    // Check if user session is valid and response.
    // Check if app token is valid.
    // Mark token status acc. response.
    // Return Result "SUCCESS" / "FAIL" to client.
    res.send( 403, "Not implemented." );
  } );

// used by 3rd party app server-side to get token.
// Requires: App Identifier, reqd permissions
router.route( '/get_token' )
  .post( ( req, res ) => {
    // Get App Identifier
    // Generate Unique Key, add it to db and send back as response.
    res.send( 403, "Not implemented." );
  } );

// Used by client-side to display login interstesial
// Requires: Token, App Identifier
router.route( '/get_code' )
  .post( ( req, res ) => {
    // Get App Identifier
    // Get Token.
    // Send QRCode and permission list.
    res.send( 403, "Not implemented." );
  } );

// Used by authentic8 app to get app info.
router.route( '/get_info' )
  .post( ( req, res ) => {
    // Get user session
    // Get Token.
    // Validate
    // Send application info and reqd permission list.
    res.status( 200 )
      .json( {
        application_name: `dummy name`,
        application_developer: `Dummy Inc.`,
        permission: [ `permission.user.name`, `permission.user.dob`, `permission.user.storage` ]
      } );
  } );

// Used by App to request user data
// Requires: Token, App Identifier, data_name
router.route( '/' )
  .post( ( req, res ) => {
    // Get App Identifier
    // Get Token.
    // Lookup database for info.
    // Return required data.
    res.send( 403, "Not implemented." );
  } )


module.exports = router;
