var express = require('express');
var router = express.Router();
var docutilsServe = require('docutils-serve');
var path = require('path');
var App = require('../lib/App').default;
var docPath = path.join(__dirname, '../doc-xml')
var React = require('react')

router.use('/doc', docutilsServe
	   ({ docPath,
	      createAppElement: (props) => React.createElement(App, props),
	    }))

router.use('/doc-xml', express.static(docPath))

module.exports = router;
