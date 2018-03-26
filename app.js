var path = require('path');
var favicon = require('serve-favicon');
var engine = require('consolidate');
var express = require('express');
var app = express();
var bodyParser = require('body-parser');

var http = require('http');
var server = http.Server(app);

app.set('views', __dirname + '/views');
app.engine('html', engine.mustache);
app.set('view engine', 'html');
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));

const consign = require('consign');

consign()
    .include("routes")
    .into(app);

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;

server.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function () {
    var addr = server.address();
    console.log("Metrozera is running at server ", addr.address + ":" + addr.port);
});