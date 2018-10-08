const express = require('express');
const router = express.Router();
const path = require('path');
const multer = require('multer');
const mysql = require('mysql');

/* GET home page. */
router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../views', 'leidsin.html'));
});

module.exports = router;


/* Adding files to database and handling uploaded files */
function addDB(req, res){
    var pildiID;

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
            pildiID = result.insertId;
        });
    });

    var storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, './uploads')
        },
        filename: function (req, file, cb) {
            cb(null, pildiID+path.extname(file.originalname))
        }
    });

    var upload = multer({ storage: storage }).single('pilt');

    upload(req, res, (err) => {
        if(err){
            console.log(err);
        }
        console.log("Fail laetud ülesse!");
    });
}

module.exports.addDB = addDB;