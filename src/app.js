require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const compression = require('compression');
const path = require('path');

// Swagger Config
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Hello World',
      version: '1.0.0',
    },
    servers: [
      {
        url: 'http://localhost:3052',
      },
    ],
  },
  apis: [
    path.join(__dirname, 'routes/*.js'),
    // path.resolve(__dirname, 'routes/**/*.js'),
  ],
  // apis: [`src/routes/*.js`, `src/routes/**/*.js`],
};

const swaggerSpec = swaggerJSDoc(options);

const app = express();

// Swagger
app.use(
  '/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, { explorer: true }),
);

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
app.use((err, req, res, next) => {
  const statusCode = err.status || 500;

  return res.status(statusCode).json({
    status: 'error',
    code: statusCode,
    stack: err.stack,
    message: err.message || 'Internal Server Error',
  });
});

module.exports = app;
