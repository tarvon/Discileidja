const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20');
const keys = require('./keys');
const mysql = require('mysql');
let ConnectDB = require('./connectDB.js');
let connection = mysql.createConnection(ConnectDB);

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

        let userSQL = 'INSERT INTO users(Id,FullName,GivenName,FamilyName,Email) VALUES(?,?,?,?,?)';
        let todo = [profile.id, profile.displayName, profile.givenName, profile.familyName, profile.email];

        connection.query(userSQL, todo, (err, results, fields) =>  {
            if (err) {
                return console.error(err.message);
            }
            console.log('Todo ID:' + results.insertId);
        });

        connection.end();
    }
));