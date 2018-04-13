const mongoose = require( 'mongoose' );
const bcrypt = require( 'bcrypt' );

var smsVerificationSchema = mongoose.Schema( {
  phone: {
    type: String,
    get: v => {
      if ( v.length < 11 ) {
        defaultprefix = "+91";
        var num = "";
        num.concat( defaultprefix, v );
        v = num;
      }
    }
  },
  otp: Number,
  timestamp: date
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
    type: Number,
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
// UserSchema.pre( 'save', ( next ) => {
//   let user = this;
//   // console.log( user.password );
//   if ( user.password ) {
//     bcrypt.hash( user.password, 10, ( err, hash ) => {
//       if ( err ) {
//         return next( err );
//       } else {
//         user.password = hash;
//         next();
//       }
//     } )
//   }
// } );

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
          return callback();
        }
      } )
    } );
}

const User = mongoose.model( 'User', UserSchema );
const smsCode = mongoose.model( 'smsCode', msVerificationSchema );
module.exports = { User, smsCode };
