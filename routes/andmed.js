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
    getDB(req.query, res);
});

function authenticationMiddleware () {
    return (req, res, next) => {
        console.log(`req.session.passport.user: ${JSON.stringify(req.session.passport)}`);

        if (req.isAuthenticated()) return next();
        res.redirect('/auth/login')
    }
}

module.exports = router;

function getDB(data, res){
    pool.getConnection(function (err, connection) {
        if ( typeof data.rada !== 'undefined' ) {
            var rada = data.rada;
            var nimi = data.nimi;
            var number = data.number;
            var värvus = data.värvus;
            var tootja = data.tootja;
            var mudel = data.mudel;

            if(mudel == "" && tootja == "" && värvus == "" && number == "" && nimi == "" && rada == ""){
                var sql = "SELECT * FROM kadunudKettad";
            } else {
                var sql = "SELECT * FROM kadunudKettad WHERE ";
                if (rada != "") {
                    sql += "rada='" + rada + "' ";
                }
                if (nimi != "") {
                    sql += "nimi='" + nimi + "' ";
                }
                if (number != "") {
                    sql += "discinumber='" + number + "' ";
                }
                if (värvus != "") {
                    sql += "värvus='" + värvus + "' ";
                }
                if (tootja != "") {
                    sql += "tootja='" + tootja + "' ";
                }
                if (mudel != "") {
                    sql += "mudel='" + mudel + "' ";
                }
            }
        } else {
            var sql = "SELECT * FROM kadunudKettad";
        }
        if (err) throw err;
        connection.query(sql, function (error, results, fields) {

            connection.release();
            if(error){
                throw error;
            } else {
                res.send(results);
            }
        });
    });
}