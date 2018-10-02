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

        let connection = mysql.createConnection({
            host: keys.AWSRDS.host,
            user: keys.AWSRDS.username,
            password: keys.AWSRDS.password,
            database: "ebdb"
        });

        connection.connect(function(err) {
            if (err) {
                return console.error('error: ' + err.message);
            }

            console.log('Connected to the MySQL server.');
            let query1 = profile.id;
            let query2 = profile.displayName;
            let query3 = profile.name.givenName;
            let query4 = profile.name.familyName;
            let query5 = profile.emails[0].value;

            let sql = "INSERT INTO users(GoogleID,FullName,GivenName,FamilyName,Email) VALUES ('"+query1+"','"+query2+"','"+query3+"','"+query4+"','"+query5+"')";

            connection.query(sql, (err, results) =>  {
                if (err) {
                    return console.error(err.message);
                }
                console.log('Todo ID:' + results.insertId);

            });
            connection.end();
        });
    }
));