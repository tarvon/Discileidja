const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20');
const FacebookStrategy = require('passport-facebook');
const mysql = require('mysql');
const nodemailer = require('nodemailer');

let keys = "";

if (process.env.NODE_ENV !== 'production'){
    keys = require('./keys');

}

let pool        = mysql.createPool({
    connectionLimit : 10, // default = 10
    host: process.env.RDS_HOSTNAME || keys.AWSRDS.host,
    user: process.env.RDS_USERNAME || keys.AWSRDS.username,
    password: process.env.RDS_PASSWORD || keys.AWSRDS.password,
    database: "ebdb"
});


// create reusable transporter object using the default SMTP transport
let transporter = nodemailer.createTransport({
    service: 'mail.ee',
    auth: {
        user: process.env.MAIL_USERNAME || keys.MAIL.username,
        pass: process.env.MAIL_PASSWORD || keys.MAIL.password
    },
    tls: {
        rejectUnauthorized:false
    }
});

// setup email data with unicode symbols
let mailOptions = {
    from: '"Discileidja" <discileidja@mail.ee>', // sender address
    to: 'bar@example.com', // list of receivers
    subject: 'Registreerimine õnnestus', // Subject line
    text: 'Oled registreerunud Discileidja kasutajaks', // plain text body
};



passport.serializeUser(function(user, done){

    console.log(user[0].id);
    done(null, user[0].id);

});

passport.deserializeUser(function(id, done){

    pool.getConnection(function(err, connection) {
        if (err) {
            return console.error('error: ' + err.message);
        }
        console.log('Connected to the MySQL server=1');

        //let sqlDeserializeUser = "SELECT * FROM users WHERE Id=?";
        connection.query("SELECT * FROM users WHERE Id=?", id,  (err, FoundUser, fields) =>  {
            if (err) {
                return console.error(err.message);
            }
            let UserID = FoundUser[0].id;
            done(null, UserID);
            connection.release();
        });
    });
});

passport.use(new GoogleStrategy({
        clientID: process.env.GoogleClientID || keys.google.clientID,
        clientSecret: process.env.GoogleClientSecret || keys.google.clientSecret,
        callbackURL: "/auth/google/redirect",
        proxy: true //for HTTPS
    },
    function(accessToken, refreshToken, profile, done) {

        pool.getConnection(function(err,connection) {
            if (err) {
                return console.error('error: ' + err.message);
            }
            console.log('Connected to the MySQL server=2');

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

                            //nodemailer upon registration
                            mailOptions.to = CreatedUser[0].Email;
                            transporter.sendMail(mailOptions, (error, info) => {
                                if (error) {
                                    return console.log(error);
                                }
                                console.log('Message sent: %s', info.messageId);
                            });

                            done(null, CreatedUser);
                            connection.release();
                        });

                    });
                }
            });
        });
    }
));


passport.use(new FacebookStrategy({
        clientID: process.env.FacebookClientID || keys.facebook.clientID,
        clientSecret: process.env.FacebookClientSecret || keys.facebook.clientSecret,
        callbackURL: "/auth/facebook/redirect",
        proxy: true //for HTTPS
    },
    function(accessToken, refreshToken, profile, done) {

        pool.getConnection(function(err,connection) {
            if (err) {
                return console.error('error: ' + err.message);
            }
            console.log('Connected to the MySQL server=2');

            let query1 = profile.id;
            let query2 = profile.displayName;
            let query3 = profile.name.givenName;
            let query4 = profile.name.familyName;
            let query5 = profile.emails[0].value;


            let sqlCurrentUser = "SELECT * FROM users WHERE FacebookID=?";
            let sqlCreatedUser = "SELECT * FROM users WHERE Id=?";
            let sqlNewUser = "INSERT INTO users(FacebookID,FullName,GivenName,FamilyName,Email) VALUES ('"+query1+"','"+query2+"','"+query3+"','"+query4+"','"+query5+"')";


            //check if user exists
            connection.query(sqlCurrentUser, profile.id, (error, currentUser, fields) => {
                if (error) {
                    return console.error(error.message);
                }
                if (currentUser.length > 0){
                    console.log("User is: ", currentUser);
                    done(null, currentUser);
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

                            //nodemailer upon registration
                            mailOptions.to = CreatedUser[0].Email;
                            transporter.sendMail(mailOptions, (error, info) => {
                                if (error) {
                                    return console.log(error);
                                }
                                console.log('Message sent: %s', info.messageId);
                            });

                            done(null, CreatedUser);
                            connection.release();
                        });

                    });
                }
            });
        });
    }
));