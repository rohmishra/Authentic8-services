const express = require( 'express' );
//const sql = require( 'sql' );
const dotenv = require( 'dotenv' );
const user = require( './../services/db_service' );

const router = express.Router();
//sql.setDialect( 'mysql' )


router.route( '/register' )
  .get( ( req, res ) => {

    if ( req.body.email &&
      req.body.username &&
      req.body.phone &&
      req.body.password &&
      req.body.passwordConf ) {
      var userData = {
        email: req.body.email,
        phone: req.body.phone,
        username: req.body.username,
        password: req.body.password,
        passwordConf: req.body.passwordConf,
      }
      //use schema.create to insert data into the db
      User.create( userData, function ( err, user ) {
        if ( err ) {
          return next( err )
        } else {
          return res.redirect( '/profile' );
        }
      } );
    }
  } )
