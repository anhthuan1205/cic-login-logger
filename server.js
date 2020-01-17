var express = require('express');
var cors = require('cors');
var bodyParser = require('body-parser');
var user = require('./route/UserRoute');
var morgan = require('morgan');
var path = require('path');
var winston = require('./config/winston');

const port = 3100;

var app = express();

app.use(morgan('combined', { stream: winston.stream }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/api', user);

app.use(function(req, res, next) {
    next(createError(404));
});

app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
  
    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

app.listen(port, function() {
    console.log('Server is running on port: ' + port);
});