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
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  }),
);

// Init DB
require('./dbs/init.mongoDB');
const { checkOverload } = require('./helpers/check.connect');

// checkOverload();

// Init Route
app.use('/', require('./routes'));

// Handling Router

module.exports = app;
