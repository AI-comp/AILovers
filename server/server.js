var express =       require('express')
    , http =        require('http')
    , path =        require('path');

var app = module.exports = express();

app.set('views', path.join(__dirname, '../client/views'));
app.set('view engine', 'jade');
app.use(express.logger('dev'))
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.static(path.join(__dirname, '../client')));
app.use(express.cookieParser());
app.use(express.cookieSession(
    {
        secret: process.env.COOKIE_SECRET || "Superdupersecret"
    }));

app.configure('development', 'production', function() {
    app.use(express.csrf());
    app.use(function(req, res, next) {
        res.cookie('XSRF-TOKEN', req.csrfToken());
        next();
    });
});

require('../server/routes.js')(app);

app.set('port', process.env.PORT || 8000);
http.createServer(app).listen(app.get('port'), function(){
    console.log("Express server listening on port " + app.get('port'));
});