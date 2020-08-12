const express = require('express');
const postsRouter = require('./posts');
const authRouter = require('./auth');

const apiRouter = express.Router();

apiRouter.use('/auth', authRouter);
apiRouter.use('/posts', postsRouter);

module.exports = apiRouter;
