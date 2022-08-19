require('./db/testconnection').connect()
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport')

const indexRouter = require('./routes/index');
const userRouter = require('./routes/user');

const app = express();

// Passport Config
require('./config/passport')(passport);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));

app.use(session({
    secret: 'mySecret',
    resave: false,
    saveUninitialized: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/css', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/css')))
app.use('/jquery', express.static(path.join(__dirname, 'node_modules/jquery/dist')))
app.use('/jsBootstrap', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/js')))

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect flash
app.use(flash());

app.use((req, res, next) => {
    res.locals.auth = req.user;
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.errors_form = req.flash('errors_form');
    res.locals.keep_values = req.flash('keep_values');
    next();
});

// Routes
app.use('/', indexRouter);
app.use('/user', userRouter);

// problème lorsqu'on enchaine les slashs
app.get('*', (req, res, next) => {
    return res.render('../views/partials/body', {
        titre: "404 Page Not Found",
        page: "errors/notFound",
        message: 'La page est introuvable.'
    });
})

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    
    // render the error page
    res.status(err.status || 500);
    res.render('errors/error');
});

module.exports = app;