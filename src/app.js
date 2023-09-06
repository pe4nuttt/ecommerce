require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const compression = require('compression');
const app = express();

// Init Middleware
app.use(morgan('dev'));
app.use(helmet());
app.use(compression());

// Init DB
require('./dbs/init.mongoDB');
const { checkOverload } = require('./helpers/check.connect');

// checkOverload();

// Init Route

// Handling Router

module.exports = app;
