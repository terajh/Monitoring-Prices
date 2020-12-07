const express = require('express');
var router = express.Router();
const bodyParser = require('body-parser');
const path = require('path');
const compression = require('compression');
const db = require('../lib/db');


router.use(compression());
router.use(bodyParser.urlencoded({ extended: false }));

module.exports = (passport) => {

    router.get('/session', (req, res) => {
        console.log('get auth',req.session.passport);
        if(req.session.passport.user === undefined) {
            res.status(200).send({success:false});
        }
        else {
            res.status(200).send({success:true, data:req.session.passport.user});
        }
    });

    router.post('/signin', passport.authenticate('local'),
        (req, res) => {
            console.log('get signin');
            res.send({status:true});
        }
    );
    router.get('/logout', (req, res) => {
        console.log('get logout');
        req.logout();
        res.send({success:true});
        
    })
    router.post('/signup', (req, res) => {
        console.log('get signup', req.body);
        var email = req.body.email;
        var password = req.body.password;
        var address = req.body.address;
        var name = req.body.name;
        var nickname = req.body.nickname;

        db.query(`select * from user where userid='${email}'`, (err, results, field) => {
            if(results.length != 0) {
                res.send({success: false});
            }
            else{
                db.query(`insert into user(userid, userpw, address, username, nickname ) values ('${email}', '${password}', '${address}', '${name}', '${nickname}');`, (err, results, field) => {
                    res.send({ success: true});
                });
            }
        })
                
    
    })
    return router;
    
}


