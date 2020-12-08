const express = require('express');
const router = express.Router();
var db = require('../lib/db');
const request = require('request')

router.post('/get_guname', (req, res) => {
    console.log('api get_guname');
    var city_name = req.body._cityname
    db.query(`select distinct guname from cigudong where cityname="${city_name}";`, (err, results, field) => {
        if(err || results === undefined || results.length === 0) {
            res.json({success:false});
        }
        else{
            var gulist = [];
            for (var i = 0; i < results.length; i++) {
                gulist.push(results[i]['guname']);
            }
            res.json({ list: gulist });
        }
    });
})

router.post('/get_dongname', (req, res) => {
    console.log('api get_dongname');
    var gu_name = req.body._guname;
    db.query(`select distinct dongname, dong from cigudong where guname="${gu_name}";`, (err, results, field) => {
        if(err) res.json({success:false});
        else{
            var donglist = [];
            var codelist = [];
            for (var i = 0; i < results.length; i++) {
                donglist.push(results[i]['dongname']);
                codelist.push(results[i]['dong'])
            }
            res.json({ list: donglist, codelist: codelist });
        }
    });
})

router.post('/get_list', (req, res) => {
    console.log('api get_list');

    var pnu = req.body.pnu;
    db.query(` select distinct _name, pnu from (select _name, dongname, pnu, dong from apart as A join cigudong as B on A.dongCode = B.dong) as C where dong='${pnu}';`, (err, results, field) => {
        if(err) res.send({success:false});
        else{
            var namelist = [];
            var pnulist = [];
            for (var i = 0; i < results.length; i++) {
                namelist.push(results[i]['_name']);
                pnulist.push(results[i]['pnu']);
            }
            res.json({ list: namelist, pnulist: pnulist});
        }
    });

})
router.post('/get_address', (req, res) => {
    console.log('api get_address');

    var pnu = req.body.pnu;
    db.query(`select address from apart where pnu='${pnu}'`, (err, results, field) => {
        if(err || results.length == 0) res.send({success:false});
        else{
            var address = results[0]['address'];
            res.json({ address: address});
        }
    });
})

router.post('/get_extra', (req, res) => {
    console.log('api get_extra');
    var pnu = req.body.pnu;
    request.get({
        headers:{
            'content-type': 'application/json, text/javascript, */*; q=0.01',
            'User-Agent' : 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.66 Safari/537.36',
            'referer' : 'http://realtyprice.chosun.com/'
        },
        url :'http://realtyprice.chosun.com/app/start.php?mode=aep&code='+pnu,
        json:true
    }, (err, res1, body) => {
        var items = body.data.items;
        db.query(`select _name, address, xLoc, yLoc, roadAddress from apart where pnu='${pnu}'`, (err, results, field) => {
            if(results.length === 0) res.json({success: false});
            else{
                var name = results[0]['_name']
                var address = results[0]['address'];
                var xLoc = results[0]['xLoc'];
                var yLoc = results[0]['yLoc'];
                var roadAddress = results[0]['roadAddress'];
                db.query(`select userid, description, dt from comments where pnu='${pnu}'`, (err, results, field) => {
                    if(err || !results) {
                        res.json({
                            success: false,
                            name:name,
                            address:address,
                            xLoc:xLoc,
                            yLoc:yLoc,
                            roadAddress:roadAddress,
                            description: [],
                            items:items
                        });
                    }
                    else {
                        var description = results;
                        res.json({
                            success: true,
                            name:name,
                            address:address,
                            xLoc:xLoc,
                            yLoc:yLoc,
                            roadAddress:roadAddress,
                            description: description,
                            items:items
                        });
                    }
                });
            }
        });
        
    })
    
})

router.post('/get_log', (req, res) => {
    console.log('api get_log');
    var pnu = req.body.pnu;
    var area = req.body.area;
    request.get({
        headers:{
            'content-type': 'application/json, text/javascript, */*; q=0.01',
            'User-Agent' : 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.66 Safari/537.36',
            'referer' : 'http://realtyprice.chosun.com/'
        },
        url :`http://realtyprice.chosun.com/app/start.php?mode=rprc&code=${pnu}&area_min=${area}&st_page=0&pagesize=5&sort=desc`,
        json:true
    }, (err, res2, body) => {
        if(err) {
            res.json({success: false});
        }
        else{
            res.json({
                success:true,
                loglist:body.items
            });
        }
    })
    
})


router.post('/input_comment', (req, res) => {
    console.log('input comment', req.body);
    var pnu = req.body.pnu;
    var description = req.body.description;
    var nickname = req.body.nickname;
    var dt = req.body.dt;
    db.query(`insert into comments(userid, description, pnu, dt) values('${nickname}','${description}', '${pnu}','${dt}')`, (err, results, field) => {
        console.log(err);
        if(err) {
            res.json({success: false});
        }
        else{
            res.json({
                success:true
            });
        }
    });
})

router.get('/getLike', (req, res) => {
    console.log('getlike', req.session.passport);
    var nickname = req.session.passport.user;
    db.query(`select _name, apart.pnu, address, userLike.user from apart join userLike on apart.pnu = userLike.pnu where userLike.user='${nickname}';`, (err, results, field) => {
        if(err) {
            res.json({success: false});
        }
        else{
            res.json({
                success:true,
                pnu:results
            });
        }
    });
})

router.post('/putLike', (req, res) => {
    console.log('putlike', req.session);
    var nickname = req.session.passport.user;
    var pnu = req.body.pnu;
    console.log(nickname, pnu)
    db.query(`select * from userLike where user='${nickname}' and pnu='${pnu}'`, (err, results, field) => {
        console.log(results);
        if(err) {
            res.json({success: false});
        }
        else{
            if(results.length !== 0){
                res.json({success: true});
            }else{
                db.query(`insert into userLike(user, pnu) values('${nickname}', '${pnu}')`, (err, results, field) => {
                    if(err) {
                        res.json({success: false});
                    }
                    else{
                        db.query(`select _name, apart.pnu, address, userLike.user from apart join userLike on apart.pnu = userLike.pnu where userLike.user='${nickname}';`, (err, results, field) => {
                            if(err) {
                                res.json({success: false});
                            }
                            else{
                                res.json({
                                    success:true,
                                    pnu:results
                                });
                            }
                        });
                    }
                });
            }
        }
    });
    
})

router.post('/removeLike', (req, res) => {
    console.log('getlike', req.session);
    var nickname = req.session.passport.user;
    var pnu = req.body.pnu;
    db.query(`delete from userLike where user='${nickname}' and pnu='${pnu}'`, (err, results, field) => {
        console.log(err, results);
        
        if(err) {
            res.json({success: false});
        }
        else{
            res.json({
                success:true
            });
        }
    })
})

router.post('/search', (req,res) => {
    console.log('search render', req.body)
    var query = req.body.query;
    db.query(`select distinct _name, pnu from apart where _name like '%${query}%' or address like '%${query}%'`, (err, results, field) => {
        console.log(err, results);
        if(err){
            res.json({success: false});
        }
        else{
            var namelist = [];
            var pnulist = [];
            for (var i = 0; i < results.length; i++) {
                namelist.push(results[i]['_name']);
                pnulist.push(results[i]['pnu']);
            }
            res.json({ success:true, list: namelist, pnulist: pnulist});
        }
    })
})
module.exports = router;

