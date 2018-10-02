const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20');
const keys = require('./keys');
const mysql = require('mysql');

let connection = mysql.createConnection({
    host: keys.AWSRDS.host,
    user: keys.AWSRDS.username,
    password: keys.AWSRDS.password,
    database: "ebdb"
});

/*connection.connect(function(err) {
    if (err) {
        throw err;
    }
    console.log("Ühendatud andmebaasiga");

});*/

passport.serializeUser(function(user, done){

    console.log(user[0].id);
    done(null, user[0].id);

});

passport.deserializeUser(function(id, done){

        //let sqlDeserializeUser = "SELECT * FROM users WHERE Id=?";
        connection.query("SELECT * FROM users WHERE Id=?", id,  (err, FoundUser, fields) =>  {
            if (err) {
                console.log("kurwa");
                return console.error(err.message);
            }
            console.log(FoundUser);
            let UserID = FoundUser[0].id;
            done(null, UserID);
        });
});

passport.use(new GoogleStrategy({
        clientID: keys.google.clientID,
        clientSecret: keys.google.clientSecret,
        callbackURL: "/auth/google/redirect"
    },
    function(accessToken, refreshToken, profile, done) {

        /*connection.connect(function(err) {
            if (err) {
                return console.error('error: ' + err.message);
            }
            console.log('Connected to the MySQL server.');*/

            let query1 = profile.id;
            let query2 = profile.displayName;
            let query3 = profile.name.givenName;
            let query4 = profile.name.familyName;
            let query5 = profile.emails[0].value;


            let sqlCurrentUser = "SELECT * FROM users WHERE GoogleID=?";
            let sqlCreatedUser = "SELECT * FROM users WHERE Id=?";
            let sqlNewUser = "INSERT INTO users(GoogleID,FullName,GivenName,FamilyName,Email) VALUES ('"+query1+"','"+query2+"','"+query3+"','"+query4+"','"+query5+"')";


            //check if user exists
            connection.query(sqlCurrentUser, profile.id, (error, currentUser, fields) => {
                if (error) {
                    return console.error(error.message);
                }
                if (currentUser.length > 0){
                    console.log("User is: ", currentUser);
                    done(null, currentUser);
                    connection.end();
                } else {

                    //create new user
                    connection.query(sqlNewUser, (err, newUser) =>  {
                        if (err) {
                            return console.error(err.message);
                        }
                        console.log('New user ID:' + newUser.insertId);
                        let CreatedUserDbId = newUser.insertId;

                        //find created user
                        connection.query(sqlCreatedUser, CreatedUserDbId,  (err, CreatedUser, fields) =>  {
                            if (err) {
                                return console.error(err.message);
                            }
                            console.log('Created user',  CreatedUser);
                            done(null, CreatedUser);
                            connection.end();
                        });

                    });
                }
            });
        //});
    }
));