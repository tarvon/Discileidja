const express = require('express');
const router = express.Router();
const path = require('path');
const multer = require('multer');
const mysql = require('mysql');
const passport = require('passport');

/* GET home page. */
router.get('/', authenticationMiddleware(), (req, res) => {
    res.sendFile(path.join(__dirname, '../views', 'leidsin.html'));
});

function authenticationMiddleware () {
    return (req, res, next) => {
        console.log(`req.session.passport.user: ${JSON.stringify(req.session.passport)}`);

        if (req.isAuthenticated()) return next();
        res.redirect('/auth/login')
    }
}

module.exports = router;