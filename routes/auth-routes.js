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
    req.logout();
    res.redirect('/');
});

// auth with google
router.get('/google', passport.authenticate('google', {
    scope: ['profile', 'email']
}));

// callback route for google to redirect to
router.get('/google/redirect', passport.authenticate('google'),(req, res) =>{
    //res.send('you reached the callback URI')
    res.redirect(req.session.returnTo || '/index/'); //redirect to user page selection after login
    req.session.returnTo = null;
});

// auth with facebook
router.get('/facebook', passport.authenticate('facebook', {
    scope: ['public_profile', 'email']
}));

// callback route for facebook to redirect to
router.get('/facebook/redirect', passport.authenticate('facebook'),(req, res) =>{
    //res.send('you reached the callback URI')
    res.redirect(req.session.returnTo || '/index/'); //redirect to user page selection after login
    req.session.returnTo = null;
});

module.exports = router;