var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/:xmlFile', function(req, res, next) {
    res.render('index', { title: req.params.xmlFile });
});

module.exports = router;
