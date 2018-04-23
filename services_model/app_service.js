/**
 *** Copyright 2018, Rohan Mishra
 *** Free to use for all purposes with or without credits.
 **/


const mongoose = require( 'mongoose' );
const bcrypt = require( 'bcrypt' );


const app = new mongoose.Schema( {
  name: {
    type: String,
    required: true
  },
  developer_name: String,
  permissions: {
    type: String,
    trim: true
  }
} );

const appSession = new mongoose.Schema( {

} )

module.exports = null;
