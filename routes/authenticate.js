const express = require( 'express' );
//const sql = require( 'sql' );
const bodyParser = require( 'body-parser' );
const User = require( './../services_model/db_service' );
const session = require( 'express-session' );
var MongoStore = require( 'connect-mongo' )( session );
const router = express.Router();
// parse incoming requests
app.use( bodyParser.json() );
app.use( bodyParser.urlencoded( { extended: false } ) );


router.route( '/register' )
  .post( ( req, res ) => {
    console.log( "REGISTERING NEW USER: " + req.body.email );
    if ( req.body.email &&
      req.body.username &&
      req.body.phone &&
      req.body.password ) {
      var userData = {
        email: req.body.email,
        phone: req.body.phone,
        username: req.body.username,
        password: req.body.password
      }
      //use schema.create to insert data into the db
      User.create( userData, function ( err, user ) {
        if ( err ) {
          return next( err )
        } else {
          return res.send( 'done' );
        }
      } );
    }
  } )

module.exports = router;
