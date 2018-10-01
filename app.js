var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const http = require('http');

const hostname = '127.0.0.1';
const port = 8081; //aws: 8081 ; local: 3000

var indexRouter = require('./routes/index');
var abiRouter = require('./routes/abi');
var leidsinRouter = require('./routes/leidsin');
var otsinRouter = require('./routes/otsin');
var profiilRouter = require('./routes/profiil');

var app = express();
app.use('/', indexRouter);
app.use('/abi', abiRouter);
app.use('/leidsin', leidsinRouter);
app.use('/otsin', otsinRouter);
app.use('/profiil', profiilRouter);
app.use(express.static(path.join(__dirname, '/public')));


module.exports = app;


const server = app.listen(port, () => {
    console.log(`Express is running on port ${server.address().port}`);
});

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});

var mysql = require('mysql');

var con = mysql.createConnection({
    host: "db-discileidja.cvtuddwcibzq.eu-central-1.rds.amazonaws.com",
    user: "root",
    password: "kettaleidjaandmebaas",
    database: "ebdb"
});

function onSignIn(googleUser) {
    // Useful data for your client-side scripts:
    var profile = googleUser.getBasicProfile();
    console.log("ID: " + profile.getId()); // Don't send this directly to your server!
    console.log('Full Name: ' + profile.getName());
    console.log('Given Name: ' + profile.getGivenName());
    console.log('Family Name: ' + profile.getFamilyName());
    console.log("Image URL: " + profile.getImageUrl());
    console.log("Email: " + profile.getEmail());
    con.connect();
    console.log("Connected!");
    var sql = "INSERT INTO users (id, eesnimi, perenimi, profiilipilturl, meiliaadress)" +
        " VALUES ('+profile.getId()+','+profile.getGivenName()+','+profile.getFamilyName()+'," +
        "'+profile.getImageUrl()+','+profile.getEmail()+' ')";
    con.query(sql, function (err, result) {
        if (err) throw err;
        console.log("1 record inserted");
    });

    // The ID token you need to pass to your backend:
    var id_token = googleUser.getAuthResponse().id_token;
    console.log("ID Token: " + id_token);
}


/*

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

*/