'use strict';

const express = require('express');
const router = express.Router();

router.use('/api/v1', require('./auth'));

// router.get('', (req, res, next) => {
//   return res.status(200).json({
//     message: 'hello world',
//   });
// });

module.exports = router;
