const express = require('express');
const app = express();
const api = require('./routes/index');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');

app.use(cors());
app.set('view engine', 'ejs')


// 정적 파일 서비스 -> public, 즉 public 폴더를 static으로 오픈
app.use(express.static(path.join(__dirname, 'public')));
app.use('/api', api);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


출처: https://boxfoxs.tistory.com/353 [박스여우 - BoxFox]

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


app.listen(3001, () => {
    console.log('Nodejs server running on port 3001');
})