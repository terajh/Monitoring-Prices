const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const mysql = require('mysql');
const { runInNewContext } = require('vm');
const qs = require('querystring')

var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'dkd352487',
    database: 'price'
});
connection.connect();


router.get('/', (req, res) => {
    console.log('http://localhost:3001/api/');
    res.send({ title: 'hello react!' });
    // client 와의 소통
});
router.get('/get_cityname', (req, res) => {
    console.log('get cityname');
    try {
        connection.query('SELECT distinct cityname FROM cigudong', (err, results, field) => {
            var citylists = [];
            for (var i = 0; i < results.length; i++) {
                citylists.push(results[i]['cityname']);
            }
            res.send({ list: citylists });
        });
    } catch (err) {
        res.send({ url: false });
    }
})

router.post('/get_guname', (req, res) => {
    console.log('get guname');
    var data = '';
    try {
        req.on('data', (chunk) => {
            data += chunk;
        })
        req.on('end', () => {
            var city_name = data.split(':')[1].split('"')[1];
            // console.log('post data ',data.split(':')[1].split('"')[1]);
            connection.query(`select distinct guname from cigudong where cityname="${city_name}";`, (err, results, field) => {
                var gulist = [];
                // console.log(results);
                for (var i = 0; i < results.length; i++) {
                    gulist.push(results[i]['guname']);
                }
                res.send({ list: gulist });
            });
        })
    }
    catch (err) {
        res.send({ url: false });
    }
})

router.post('/get_dongname', (req, res) => {
    console.log('get dongname');
    var data = '';
    try {
        req.on('data', (chunk) => {
            data += chunk;
        })
        req.on('end', () => {
            var gu_name = data.split(':')[1].split('"')[1];
            // console.log('post data ',data.split(':')[1].split('"')[1]);
            connection.query(`select distinct dongname from cigudong where guname="${gu_name}";`, (err, results, field) => {
                var donglist = [];
                // console.log(results);
                for (var i = 0; i < results.length; i++) {
                    donglist.push(results[i]['dongname']);
                }
                // console.log(donglist);
                res.send({ list: donglist });
            });
        })
    }
    catch (err) {
        res.send({ url: false });
    }
})

router.post('/get_list', (req, res) => {
    console.log('get list');
    var body = '';
    try{
        req.on('data', function (data) {
            body += data;
            if (body.length > 1e6)
                req.connection.destroy();
        });

        req.on('end', function () {
            var data = JSON.parse(body);
            connection.query(` select distinct _name, pnu from (select _name, dongname, pnu from apart as A join cigudong as B on A.dongCode = B.dong) as C where dongname='${data.code}';`, (err, results, field) => {
                var namelist = [];
                var pnulist = [];
                for (var i = 0; i < results.length; i++) {
                    namelist.push(results[i]['_name']);
                    pnulist.push(results[i]['pnu']);
                }
                res.send({ list: namelist, pnulist: pnulist});
            });
            // res.send({ list: ['A빌라', 'B빌라', 'C빌라', 'D빌라', 'E빌라'] });

        });
    }
    catch(err){
        res.send({list:false});
    }
})
router.post('/get_loc', (req, res) => {
    console.log('get dongname');
    var data = '';
    try {
        req.on('data', (chunk) => {
            data += chunk;
        })
        req.on('end', () => {
            var gu_name = data.split(':')[1].split('"')[1];
            // console.log('post data ',data.split(':')[1].split('"')[1]);
            connection.query(`select distinct dongname from cigudong where guname="${gu_name}";`, (err, results, field) => {
                var donglist = [];
                console.log(results);
                for (var i = 0; i < results.length; i++) {
                    donglist.push(results[i]['dongname']);
                }
                console.log(donglist);
                res.send({ list: donglist });
            });
        })
    }
    catch (err) {
        res.send({ url: false });
    }
})

module.exports = router;

