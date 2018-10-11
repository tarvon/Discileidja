const express = require('express');
const router = express.Router();
const path = require('path');
const multer = require('multer');
const mysql = require('mysql');

/* GET home page. */
router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../views', 'leidsin.html'));
});

module.exports = router;