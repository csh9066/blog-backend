const express = require('express');

const postsController = require('../controllers/postsController');
const isLoggedIn = require('../lib/isLoggedIn');

const postsRouter = express.Router();

postsRouter.get('/', postsController.list);
postsRouter.post('/', isLoggedIn, postsController.write);
postsRouter.get('/:id', postsController.read);
postsRouter.delete('/:id', isLoggedIn, postsController.remove);
postsRouter.put('/:id', postsController.replace);
postsRouter.patch('/:id', isLoggedIn, postsController.update);

module.exports = postsRouter;
