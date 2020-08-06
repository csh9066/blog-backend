const express = require('express');

const postsController = require('../controllers/postsController');

const postsRouter = express.Router();

postsRouter.get('/', postsController.list);
postsRouter.post('/', postsController.write);
postsRouter.get('/:id', postsController.read);
postsRouter.delete('/:id', postsController.remove);
postsRouter.put('/:id', postsController.replace);
postsRouter.patch('/:id', postsController.update);

module.exports = postsRouter;
