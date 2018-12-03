var express = require('express');
var router = express.Router();
var path = require('path');
const passport = require('passport');
const mysql = require('mysql');
const bodyParser = require('body-parser');

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

let keys = "";
if (process.env.NODE_ENV !== 'production'){
    keys = require('../config/keys');
}

let pool = mysql.createPool({
    connectionLimit : 10, // default = 10
    host: process.env.RDS_HOSTNAME || keys.AWSRDS.host,
    user: process.env.RDS_USERNAME || keys.AWSRDS.username,
    password: process.env.RDS_PASSWORD || keys.AWSRDS.password,
    database: "ebdb"
});

/* Send database info */
router.post('/', authenticationMiddleware(), (req, res) => {
    //lisada andmete kontroll, kas maht liiga suur või kõik tühi, kas numbrid on numbrid

    var query1 = req.body.rada.toString();
    var query2 = req.body.nimi.toString();
    var query3 = req.body.telefoninumber;
    var query4 = req.body.värvus.toString();
    var query5 = req.body.tootja.toString();
    var query6 = req.body.mudel.toString();
    var query7 = req.body.lisainfo.toString();
    var query8 = req.session.passport.user;

    var sql = "DELETE FROM ebdb.kadunudKettad WHERE rada='"+query1+"' AND nimi='"+query2 + "' AND telefoninumber='"+query3 + "' AND värvus='"+query4 + "' AND tootja='"+query5 + "' AND mudel='"+query6 + "' AND lisainfo='"+query7 + "' AND lisaja='"+query8+"'";
    pool.getConnection(function (err, connection) {
        if(err){
            res.send(err.toString());
        }
        connection.query(sql, function (error, results, fields) {
            connection.release();
            if(err) throw err;
            console.log(sql);
            console.log("Kirje eemaldatud!");
            res.send("");
        });
    });
});

function authenticationMiddleware () {
    return (req, res, next) => {
        console.log(`req.session.passport.user: ${JSON.stringify(req.session.passport)}`);

        if (req.isAuthenticated()) return next();
        req.session.returnTo = req.originalUrl;
        res.redirect('/auth/login')
    }
}

module.exports = router;