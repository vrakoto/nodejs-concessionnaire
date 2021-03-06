var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var session = require('express-session')
const { default: mongoose } = require('mongoose');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// conf express session
app.use(session({
  secret: 'mySecret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    expires: 1000
  }})
);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/css', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/css')))
app.use('/jquery', express.static(path.join(__dirname, 'node_modules/jquery/dist')))
app.use('/jsBootstrap', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/js')))

app.use((req, res, next) => {
  res.locals.login = "62a0e001617d74a26724fd81"
  // res.locals.login = req.session.login;
  next();
});

app.use('/', indexRouter);
app.use('/users', usersRouter);



mongoose.connect(`mongodb+srv://${id}:${mdp}@cluster0.ftrta.mongodb.net/?retryWrites=true&w=majority`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).catch (err => {
    console.log(err);
})



app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;