var path = require('path');
var express = require('express');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var flash = require('connect-flash');
var config = require('config-lite');
var routes = require('./routes');
var pkg = require('./package');
var expressFormidable = require('express-formidable');

var app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
    name:config.session.key,
    secret: config.session.secret,
    cookie: {
        maxAge: config.session.maxAge
    },
    store: new MongoStore({
        url:config.mongodb
    })
}));

app.use(flash());

app.use(expressFormidable({
    uploadDir: path.join(__dirname, 'public/img'),
    keepExtensions: true
}));

app.locals.blog = {
    title: pkg.name,
    description: pkg.description
}

app.use(function (req, res, next) {
    res.locals.user = req.session.user;
    res.locals.success = req.flash('success').toString();
    res.locals.error = req.flash('error').toString();
    next();
})

routes(app);

app.listen(config.port, function () {
    console.log(`${pkg.name} listening on port ${config.port}`)
})