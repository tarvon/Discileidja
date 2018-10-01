const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20');
const keys = require('./keys');
const mysql = require('mysql');



passport.serializeUser((user, done)=>{
    done(null, user.id);
});



passport.use(new GoogleStrategy({
        clientID: keys.google.clientID,
        clientSecret: keys.google.clientSecret,
        callbackURL: "/auth/google/redirect"
    },
    function(accessToken, refreshToken, profile, done) {
        //check if user exists
        console.log(profile);

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

        var user = {Id: profile.id, FullName: profile.displayName, GivenName: profile.givenName, FamilyName: profile.familyName, Email: profile.email};
        con.query('INSERT INTO users SET ?', user, (err,res) => {
            if(err) throw err;

        });
        console.log('Last inserted ID:', res.insertId);
        User.findOrCreate({ googleId: profile.id }, function (err, user) {
            return done(err, user);
        });
    }
));
