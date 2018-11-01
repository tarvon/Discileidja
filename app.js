var express = require('express');
var path = require('path');
const passport = require('passport');
var session = require('express-session');
var MySQLStore = require('express-mysql-session')(session)
const ipinfo = require("ipinfo");
const browser = require('browser-detect');
const mysql = require("mysql");
require('./config/passport-setup');
const expressip = require('express-ip');

const hostname = '127.0.0.1';
const port = process.env.PORT || 3000; //aws: 8081 ; local: 3000

var authRouter = require('./routes/auth-routes');
var homeRouter = require('./routes/home');
var indexRouter = require('./routes/index');
var abiRouter = require('./routes/abi');
var leidsinRouter = require('./routes/leidsin');
var otsinRouter = require('./routes/otsin');
var profiilRouter = require('./routes/profiil');
var andmedRouter = require('./routes/andmed');
var statsRouter = require('./routes/stats');
var statsGETRouter = require('./routes/statsGET');
var leidsin = require('./lib/leidsin');

var app = express();

//Tell express that HTTPS is used in Nginx
//https://stackoverflow.com/questions/20739744/passportjs-callback-switch-between-http-and-https
app.set('trust proxy', 2);

let keys = "";

if (process.env.NODE_ENV !== 'production'){
    keys = require('./config/keys');
}

let pool        = mysql.createPool({
    connectionLimit : 10, // default = 10
    host: process.env.RDS_HOSTNAME || keys.AWSRDS.host,
    user: process.env.RDS_USERNAME || keys.AWSRDS.username,
    password: process.env.RDS_PASSWORD || keys.AWSRDS.password,
    database: "ebdb"
});

// Redirect to HTTPS
app.use(function (req, res, next) {
    // Insecure request?
    if (req.get('x-forwarded-proto') === 'http') {
        // Redirect to https://
        return res.redirect('https://' + req.get('host') + req.url);
    }

    next();
});

let options = {
    host: process.env.RDS_HOSTNAME || keys.AWSRDS.host,
    user: process.env.RDS_USERNAME || keys.AWSRDS.username,
    password: process.env.RDS_PASSWORD || keys.AWSRDS.password,
    database: "ebdb"
};

let sessionStore = new MySQLStore(options);

app.use(session({
    secret: 'kurwa',
    store: sessionStore,
    resave: false,
    saveUninitialized: false
}));

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
app.use('/andmed', andmedRouter);
app.use('/stats', statsRouter);
app.use('/statsGET', statsGETRouter);
app.use(express.static(path.join(__dirname, '/public')));
app.use(expressip().getIpInfoMiddleware);

// collect visitor data
app.use(function (req, res, next) {

    //helping function for adding 0 values to date objects
    function pad(value) {
        if(value < 10) {
            return '0' + value;
        } else {
            return value;
        }
    }

    let date = new Date();
    let currentDate = date.getFullYear() + "/" + pad(date.getMonth()+1) + "/" + pad(date.getDate());
    let currentTime = pad(date.getHours()) + ":" + pad(date.getMinutes()) + ":" + pad(date.getSeconds());

    let browserDetectResult = browser(req.headers['user-agent']);
    let currentBrowser = browserDetectResult.name;
    let currentos = browserDetectResult.os;

    let ipa = req.ip;

    console.log(ipa);

    //https://stackoverflow.com/questions/7139369/remote-ip-address-with-node-js-behind-amazon-elb
    ipinfo(ipa, (err, cLoc) => {

        let city = cLoc.city;
        let country = cLoc.country;
        let hostname = cLoc.hostname;
        let ip = cLoc.ip;

        let sqlVisitor = "INSERT INTO visitors(date,time,city,country,hostname,ip,browser,os) " +
            "VALUES ('"+currentDate+"','"+currentTime+"','"+city+"','"+country+"','"+hostname+"','"+ip+"','"+currentBrowser+"','"+currentos+"')";

        pool.getConnection(function(err, connection) {
            connection.query(sqlVisitor, function (error, results, fields) {
                connection.release();
                if (error) throw error;
            });
        });
    });
});

module.exports = app;

const server = app.listen(port, () => {
    console.log(`Express is running on port ${server.address().port}`);
});

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});


/*var https = require('https'),
    fs = require('fs'),
    utillib = require('util');

var options2 = {
    key: fs.readFileSync('key.pem'),
    cert: fs.readFileSync('certificate.pem'),
    ca: [
        fs.readFileSync('ESTEID-SK_2007.PEM.crt'),
        fs.readFileSync('ESTEID-SK.PEM.crt'),
        fs.readFileSync('JUUR-SK.PEM.crt')
    ],
    requestCert: false,
    rejectUnauthorized: false
};

https.createServer(options2, function (req, res) {
    res.setHeader("Content-type","text/plain; charset=utf-8");
    res.writeHead(200);
    res.end(utillib.inspect(req.connection.getPeerCertificate()));
}).listen(443);



 post method in leidsin.html
app.post('/leidsin', (req, res) => {
    leidsin.addDB(req, res);
    res.end();
}); */