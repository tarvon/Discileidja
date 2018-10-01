const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20');
const keys = require('./keys');
const mysql = require('mysql');

//database connection
var con = mysql.createConnection({
    host: keys.AWSRDS.host,
    user: keys.AWSRDS.username,
    password: keys.AWSRDS.password,
    database: "ebdb"
});

con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
});

passport.use(new GoogleStrategy({
        clientID: keys.google.clientID,
        clientSecret: keys.google.clientSecret,
        callbackURL: "/auth/google/redirect"
    },
    function(accessToken, refreshToken, profile, done) {
        var User = {Id: profile.getId(), FullName: profile.getName(),
        GivenName: profile.getGivenName(), FamilyName: profile.getFamilyName(),
        Email: profile.getEmail()};
        con.query('INSERT INTO users SET ?', user, (err,res) => {
            if(err) throw err;

            console.log('Last inserted ID:', res.inertId);

        })
    }
));
