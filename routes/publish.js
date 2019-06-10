const express = require('express');
const ReactDOMServer = require('react-dom/server');

const router = express.Router();
const path = require('path');
const React = require('react');

router.use('/publish', (req, res, next) => {
  res.render('publish', { entry: '/pubbundle.js' });
});

module.exports = router;
