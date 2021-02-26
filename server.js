const express = require('express');
const logger = require('morgan');
const app = express();
const path = require('path');
const compression = require('compression'); // 파일 압축 송수신
const cors = require('cors');
const bodyParser = require('body-parser');
const https = require('https');
const http = require('http');
const fs = require('fs');

const session = require('express-session');
const FileStore = require('session-file-store')(session);
var bgetHost = require('./lib/host');
var hostname = bgetHost();

var privateKey = fs.readFileSync("/etc/letsencrypt/live/joopi.cf/privkey.pem");
var certificate = fs.readFileSync("/etc/letsencrypt/live/joopi.cf/cert.pem");
var ca = fs.readFileSync("/etc/letsencrypt/live/joopi.cf/chain.pem");
const credentials = {key:privateKey, cert:certificate, ca:ca};

app.use(cors({
	origin:[
		"https://terajh.github.io/Monitoring-Prices/"
	],
	methods: "GET, HEAD, PUT, PATCH, POST, DELETE",
	preflightContinue: false,
	optionsSuccessStatus:204,
    	credentials: true
}));
app.set('view engine', 'ejs')

// 정적파일
app.use(session({  // 2
    secret: 'secretkey',  // 암호화
    resave: false, 
    // 세션 데이터라는 것이 바뀌기 전까지는 세션 저장소의 값을
    // 저장하지 않는다. true면 값이 바꼇던 안바뀌엇던 무조건 저장한다.
    saveUninitialized: true,
    // 세션이 필요하기 전까지는 세션을 구동시키지 않는다. (true)
    store: new FileStore()
  }));

app.use(compression());
app.use(logger('dev'));

app.use(express.static(path.join(__dirname, '/public')));
app.use(express.static(path.join(__dirname, '/node_modules')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


var passport = require('./lib/passport.js')(app); // refactoring
const apiRouter = require('./routes/api');
const authRouter = require('./routes/auth')(passport);

app.use('/api', apiRouter);
app.use('/auth', authRouter);


  
// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    // render the error page
    res.status(err.status || 500);
});

app.listen(3001,() => console.log('listening'));
