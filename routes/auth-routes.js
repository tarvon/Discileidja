var express = require('express');
var router = express.Router();
var path = require('path');
const passport = require('passport');

// auth login
router.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '../views', 'login.html'));
});

// auth logout
router.get('/logout', (req,res) => {
    //handle with passport
    res.send('logging out');
});

// auth with google
router.get('/google', passport.authenticate('google', {
    scope: ['profile', 'email']
}));

// callback route for google to redirect to

router.get('/google/redirect', passport.authenticate('google'),(req, res) =>{
    //res.send('you reached the callback URI')
    res.redirect('/index/');
});


module.exports = router;