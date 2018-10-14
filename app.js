var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const http = require('http');
const passportSetup = require('./config/passport-setup');
const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');
const passport = require('passport');
const multer = require('multer');

const hostname = '127.0.0.1';
const port = process.env.PORT || 3000; //aws: 8081 ; local: 3000

var authRouter = require('./routes/auth-routes');
var homeRouter = require('./routes/home');
var indexRouter = require('./routes/index');
var abiRouter = require('./routes/abi');
var leidsinRouter = require('./routes/leidsin');
var otsinRouter = require('./routes/otsin');
var profiilRouter = require('./routes/profiil');
var leidsin = require('./lib/leidsin');

var app = express();

if (process.env.NODE_ENV !== 'production'){
    const keys = require('./config/keys');

    app.use(cookieSession({
        maxAge: 24 * 60 * 60 * 1000,
        keys: [process.env.CookieSessionKey || keys.session.cookieKey]

    }));
}

//initialize passport
app.use(passport.initialize());
app.use(passport.session());

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



/* post method on leidsin.html */
app.post('/leidsin', (req, res) => {
    leidsin.addDB(req, res);
    res.end();
});