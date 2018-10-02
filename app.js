var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const http = require('http');
const passportSetup = require('./config/passport-setup');
const mysql = require('mysql');
const keys = require('./config/keys');
const bodyParser = require('body-parser');

const hostname = '127.0.0.1';
const port = 8081; //aws: 8081 ; local: 3000

var authRouter = require('./routes/auth-routes');
var homeRouter = require('./routes/home');
var indexRouter = require('./routes/index');
var abiRouter = require('./routes/abi');
var leidsinRouter = require('./routes/leidsin');
var otsinRouter = require('./routes/otsin');
var profiilRouter = require('./routes/profiil');

var app = express();
app.use('/auth', authRouter);
app.use('/', homeRouter);
app.use('/index', indexRouter);
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

/*
//post method ja andmebaasi lisamine
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.post('/leidsin', function (req, res) {
    //lisada piltidega tegelemine
    var con = mysql.createConnection({
        host: "db-discileidja.cvtuddwcibzq.eu-central-1.rds.amazonaws.com",
        user: "root",
        password: "kettaleidjaandmebaas",
        database: "ebdb"
    });

    con.connect(function(err) {
        if (err) {
            throw err;
        }
        console.log("Ühendatud andmebaasiga");

        //lisada kontrollid
        var query1 = req.body.asukoht.toString();
        var query2 = req.body.nimi.toString();
        var query3 = req.body.number;
        var query4 = req.body.värvus.toString();
        var query5 = req.body.tootja.toString();
        var query6 = req.body.mudel.toString();
        var query7 = req.body.lisainfo.toString();
        var sql = "INSERT INTO kadunudKettad(rada, nimi, discinumber, värvus, tootja, mudel, lisainfo, pilt) VALUES ('"+query1+"','"+query2+"','"+query3+"','"+query4+"','"+query5+"','"+query6+"','"+query7+"','pilt')";

        con.query(sql, function (err, result) {
            if (err) {
                throw err;
            }
            console.log("Lisatud andmebaasi!");
        });
    });
    res.send('Töötab');
    res.end();
});
*/


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