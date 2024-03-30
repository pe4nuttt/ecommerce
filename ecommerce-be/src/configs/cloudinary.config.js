'use strict';
require('dotenv').config();
const cloudinary = require('cloudinary').v2;

// Return "https" URLs by setting secure: true
cloudinary.config({
  secure: true,
  cloud_name: 'pe4nuttt-shopdev',
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Log the configuration
console.log(cloudinary.config());

module.exports = cloudinary;
