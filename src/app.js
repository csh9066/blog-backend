const express = require('express');
const dotenv = require('dotenv');
const logger = require('morgan');

const apiRouter = require('./api');
const db = require('./models');

dotenv.config();
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

db.sequelize
  .sync()
  .then(() => {
    console.log('db 연결 성공');
  })
  .catch((e) => {
    console.error(e);
  });

app.use(logger('dev'));

app.use('/api', apiRouter);

app.listen(4000, () => {
  console.log('linstening to port 4000');
});
