const path = require('path');
const multer = require('multer');
const mysql = require('mysql');
const keys = require('../config/keys');
const fs = require('fs');

/* Adding files to database and handling uploaded files */
//lisada piirang andmetele
//lisada kui ei ole pilti lisatud

let pool = mysql.createPool({
    connectionLimit : 10, // default = 10
    host: keys.AWSRDS.host,
    user: keys.AWSRDS.username,
    password: keys.AWSRDS.password,
    database: "ebdb"
});

function addDB(req, res){
    var algne, filetype;
    pool.getConnection(function (err, connection) {
        var query1 = req.body.asukoht.toString();
        var query2 = req.body.nimi.toString();
        var query3 = req.body.number;
        var query4 = req.body.värvus.toString();
        var query5 = req.body.tootja.toString();
        var query6 = req.body.mudel.toString();
        var query7 = req.body.lisainfo.toString();

        var sql = "INSERT INTO kadunudKettad(rada, nimi, discinumber, värvus, tootja, mudel, lisainfo) VALUES " +
            "('" + query1 + "','" + query2 + "','" + query3 + "','" + query4 + "','" + query5 + "','" + query6 + "','" + query7 + "')";

        if (err) throw err;
        connection.query(sql, function (error, results, fields) {
            var pildiID = results.insertId.valueOf();

            fs.rename('./uploads/'+algne, './uploads/'+pildiID+filetype, function(err) {
                if(err){
                    console.log(err);
                } else {
                    console.log("Failinimi muudetud:" + pildiID+filetype);
                }
            });

            connection.release();
            if(error){
                throw error;
            } else {
                console.log("Lisatud andmebaasi!");
            }
        });
    });

    var storage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, './uploads')
        },
        filename: (req, file, cb) => {
            cb(null, algne = Date.now()+path.extname(file.originalname))
            filetype=path.extname(file.originalname);
        }
    });

    var upload = multer({storage: storage}).single('pilt');

    upload(req, res, (err) => {
        if(err){
            console.log(err);
        }else{
            console.log("Fail laetud ülesse!");
        }
    });
}

module.exports.addDB = addDB;

