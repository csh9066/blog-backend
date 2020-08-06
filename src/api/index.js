const express = require('express');
const postsRouter = require('./posts');

const apiRouter = express.Router();

apiRouter.use('/api', postsRouter);

module.exports = apiRouter;
