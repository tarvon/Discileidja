var express = require('express');
var router = express.Router();
var path = require('path');
const passport = require('passport');
const multer = require('multer');
const fs = require('fs');

router.post('/', authenticationMiddleware(), (req, res) => {
    var storage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, './uploads')
        },
        filename: (req, file, cb) => {
            cb(null, algne = req.session.passport.user + "_" + Date.now() + path.extname(file.originalname))
            filetype=path.extname(file.originalname);
        }
    });

    var upload = multer({storage: storage}).single('pilt');
    upload(req, res, (err) => {
        if(err){
            console.log(err);
        }else{
            console.log("Fail laetud ülesse!");
        }
    });
});


function authenticationMiddleware () {
    return (req, res, next) => {
        console.log(`req.session.passport.user: ${JSON.stringify(req.session.passport)}`);

        if (req.isAuthenticated()) return next();
        req.session.returnTo = req.originalUrl;
        res.redirect('/auth/login')
    }
}

module.exports = router;

