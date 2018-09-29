var express = require('express');
var router = express.Router();
var path = require('path');

/* GET home page. */
router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../views', 'abi.html'));
});

module.exports = router;