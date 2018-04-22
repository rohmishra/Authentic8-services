/**
 *** Copyright 2017, Rohan Mishra
 *** Free to use for all purposes with or without credits.
 **/


const mongoose = require( 'mongoose' );
const bcrypt = require( 'bcrypt' );

mongoose.set( 'debug', true );

var smsVerificationSchema = new mongoose.Schema( {
  phone: {
    type: String,
    get: v => {
      if ( v.length < 11 ) {
        defaultprefix = "+91";
        var num = "";
        num.concat( defaultprefix, v );
        v = num;
      }
      console.log( "DB Model: using phone number: " + v );
    }
  },
  otp: Number,
  timestamp: Date
} );

const UserSchema = new mongoose.Schema( {
  email: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  username: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  phone: {
    type: String,
    unique: false,
    required: true
  },
  password: {
    type: String,
    required: true,
  }
} );

// Password hash
// Disabled for now.
// TODO: Enable hashing before next test.
UserSchema.pre( 'save', ( next ) => {
  console.log( "DB Model: pre: bcrypt hashing password...." );
  let user = this;
  console.log( `using password: ` + user.password + `document: ` + user );
  if ( user.password ) {
    bcrypt.hash( user.password, 10, ( err, hash ) => {
      if ( err ) {
        return next( err = new Error( "hash fail." ) );
        console.log( `unable to hash password.` );
      } else {
        user.password = hash;
        console.log( `hash complete.` );
        next();
      }
    } )
  }
  console.log( "DB Model: pre: bcrypt hash & salt done!" );
} );

UserSchema.post( 'save', function ( error, doc, next ) {
  if ( error.name === 'MongoError' && error.code === 11000 ) {
    next( new Error( 'There was a duplicate key error. User Possibly already registered.' ) );
  } else {
    next( error );
  }
  if ( !error ) {
    console.log( `DB Model: post: No error.` );
  }
} );

UserSchema.statics.authenticate = ( email, password, callback ) => {
  User.findOne( { email: email } )
    .exec( ( err, user ) => {
      if ( err ) {
        return callback( err )
      } else if ( !user ) {
        var err = new Error( 'User not found.' );
        err.status = 401;
        return callback( err );
      }
      bcrypt.compare( password, user.password, function ( err, result ) {
        if ( result === true ) {
          // TODO: create a sessionID and attach to user.
          return callback( null, user );
        } else {
          return callback( null, `pasword mismatch.` );
        }
      } )
    } );
}

const User = mongoose.model( 'User', UserSchema );
const smsCode = mongoose.model( 'smsCode', smsVerificationSchema );
module.exports = [ User, smsCode ];
