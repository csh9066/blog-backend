const express = require('express');
const dotenv = require('dotenv');
const logger = require('morgan');
const session = require('express-session');
const passport = require('passport');

const apiRouter = require('./api');
const db = require('./models');
const passportConfig = require('./passport');

dotenv.config();
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(logger('dev'));
app.use(
  session({
    secret: process.env.COOKIE_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
      httpOnly: true,
    },
  }),
);
app.use(passport.initialize());
app.use(passport.session());

passportConfig();

db.sequelize
  .sync({ alter: true })
  .then(() => {
    console.log('db 연결 성공');
  })
  .catch((e) => {
    console.error(e);
  });

app.use('/api', apiRouter);

app.listen(4000, () => {
  console.log('linstening to port 4000');
});
