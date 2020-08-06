const dotenv = require('dotenv');
const path = require('path');

dotenv.config({
  path: path.join(__dirname, '../', '../', '/.env'),
});

module.exports = {
  development: {
    username: 'root',
    password: process.env.DB_PASSWORD,
    database: 'blog',
    host: '127.0.0.1',
    dialect: 'mysql',
  },
  test: {
    username: 'root',
    password: process.env.DB_PASSWORD,
    database: 'blog',
    host: '127.0.0.1',
    dialect: 'mysql',
  },
  production: {
    username: 'root',
    password: process.env.DB_PASSWORD,
    database: 'blog',
    host: '127.0.0.1',
    dialect: 'mysql',
  },
};
