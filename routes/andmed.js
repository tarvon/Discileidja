var express = require('express');
var router = express.Router();
var path = require('path');
const passport = require('passport');
const mysql = require('mysql');
const bodyParser = require('body-parser');

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
router.get('/', authenticationMiddleware(), (req, res) => {
    pool.getConnection(function (err, connection) {
        var rada = req.query.rada;
        var nimi = req.query.nimi;
        var discinumber = req.query.discinumber;
        var värvus = req.query.värvus;
        var tootja = req.query.tootja;
        var mudel = req.query.mudel;

        if(mudel == undefined && tootja == undefined && värvus == undefined && discinumber == undefined && nimi == undefined && rada == undefined){
            var otsing = [{}];
            var sql = "SELECT * FROM kadunudKettad";
        }else{
            var otsing = [{'rada':rada, 'nimi':nimi, 'discinumber':discinumber, 'värvus':värvus, 'tootja':tootja, 'mudel':mudel}];

            var sql = "SELECT * FROM kadunudKettad WHERE ";
            if (rada != "" && typeof rada != 'undefined') {
                sql += "rada='" + rada + "' AND ";
            }
            if (nimi != "" && typeof nimi != 'undefined') {
                sql += "nimi='" + nimi + "' AND ";
            }
            if (discinumber != "" && typeof discinumber != 'undefined') {
                sql += "discinumber='" + discinumber + "' AND ";
            }
            if (värvus != "" && typeof värvus != 'undefined') {
                sql += "värvus='" + värvus + "' AND ";
            }
            if (tootja != ""  && typeof tootja != 'undefined') {
                sql += "tootja='" + tootja + "' AND ";
            }
            if (mudel != ""  && typeof mudel != 'undefined') {
                sql += "mudel='" + mudel + "' AND ";
            }
            sql = sql.substring(0, sql.length-4);
        }
        if (err) throw err;
        console.log("Otsin lehel otsiti: " + sql);
        connection.query(sql, function (error, results, fields) {
            connection.release();
            if(error){
                throw error;
            } else {
                res.send(otsing.concat(results));
            }
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