module.exports = function(app) {
    // 세션 기본 값을 설정하는 일종의 초기화 함수
    var db = require('./db.js');
    var passport = require('passport'),
        LocalStrategy = require('passport-local').Strategy;
    // import passport modules & Strategy modules
    
    app.use(passport.initialize());
    app.use(passport.session());
    // passport 는 내부적으로 session 을 쓰겟다.


    passport.serializeUser(function(user, done) {
        done(null, user.nickname);
        // 로그인 성공시 세션스토어에 저장
    });
    // 로그인에 성공했을 때 해당 정보를 세션의 passport에 저장
    // 하는 역할을 한다.

    passport.deserializeUser(function(id, done) {
        var sql = 'SELECT * FROM user WHERE nickname=?';
        db.query(sql, [id], (error, results) => {
                return done(null, results[0]);
            })
            // authData가 req의 user 에 전달되도록 
            // 약속되어있다.
    });
    // 페이지에 리로드 할 때마다 로그인했는지 세션값을 확인하는
    // 역할을 한다.

    passport.use(new LocalStrategy({
            usernameField : 'email',
            passwordField : 'password',
            passReqToCallback : true
        },
        function(req, email, password, done) {
            var sql = 'SELECT * FROM user WHERE userid=?';
            db.query(sql, [email], (error, results) => {
                // 이 떄 results 는 배열로 반환된다.
                if (error) throw error;
                if (results.length === 0) {
                    console.log('incorrect userid');
                    return done(null, false, { message: 'Incorrect userid' });
                } else {
                    if (password === results[0].userpw) {
                        console.log('login ok')
                        return done(null, results[0]);
                    } else {
                        console.log('incorrect password');
                        return done(null, false, { message: 'Incorrect password' });
                    }
                }
            })
        }
    ));
    return passport;
}