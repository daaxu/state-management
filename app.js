'use strict';
const express = require('express');
const session = require('express-session');
const passport = require('./utils/pass');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

const loggedIn = (req, res, next) => {
  if (req.user) {
    next();
  } else {
    res.redirect('/form');
  }
};

const username = 'foo';
const password = 'bar';


// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}));
// parse application/json
app.use(bodyParser.json());


app.use(cookieParser());
app.use(session(
  { 
    secret: 'keyboard cat', 
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true , maxAge: 3600}

  },
));

app.use(passport.initialize());
app.use(passport.session());

app.set('views', './views');
app.set('view engine', 'pug');

app.get('/', (req, res) => {
  res.render('home');
});

app.get('/form', (req, res) => {
  res.render('form');
});

app.get('/secret', loggedIn, (req, res) => {
  res.render('secret');
});

app.post('/login',
    passport.authenticate('local', {failureRedirect: '/form'}),
    (req, res) => {
      console.log('success');
      res.redirect('/secret');
    });

    app.get('logout', (req,res)=>{
      req.logOut();
      res.redirect('/');
    });

app.get('/setCookie/:clr', (req, res) =>{
  res.cookie('color', req.params.clr);
  res.send('moro');
});

app.get('/readCookie', (req, res) =>{
  console.log('Cookies: ', req.cookies.color);
  res.send('moro');
});

app.get('/deleteCookie', (req, res) =>{
  res.clearCookie('color');
  res.send('moro');
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
