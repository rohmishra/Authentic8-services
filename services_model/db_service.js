const mongoose = require( 'mongoose' );
const bcrypt = require( 'bcrypt' );
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

//Password hash
UserSchema.pre( 'save', ( next ) => {
  const user = this;
  bcrypt.hash( user.password, 10, function ( err, hash ) {
    if ( err ) {
      return next( err );
    } else {
      user.password = hash;
      next();
    }
  } )
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
          return callback();
        }
      } )
    } );
}

const User = mongoose.model( 'User', UserSchema );
module.exports = User;
