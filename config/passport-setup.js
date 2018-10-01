const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20');
const keys = require('./keys');
const mysql = require('mysql');
const con = require('../app.js')

passport.use(new GoogleStrategy({
        clientID: keys.google.clientID,
        clientSecret: keys.google.clientSecret,
        callbackURL: "/auth/google/redirect"
    },
    function(accessToken, refreshToken, profile, done) {
        //check if user exists
        console.log(profile);

        var User = {Id: profile.id, FullName: profile.displayName, GivenName: profile.givenName, FamilyName: profile.familyName, Email: profile.email};
        con.query('INSERT INTO users SET ?', User, (err,res) => {
            if(err) throw err;

            console.log('Last inserted ID:', res.insertId);

        })
    }
));
