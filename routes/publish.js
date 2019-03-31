var express = require('express');
var ReactDOMServer = require('react-dom/server');
var router = express.Router();
var path = require('path');
var React = require('react')

router.use('/publish', (req, res, next) => {
    res.render('publish', { entry: "/pubbundle.js" } );
})

module.exports = router;
