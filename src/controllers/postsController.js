const { Post, Tag } = require('../models');
const Joi = require('joi');

// eslint-disable-next-line no-unused-vars
exports.write = async (req, res, next) => {
  const schmea = Joi.object().keys({
    title: Joi.string().required(),
    body: Joi.string().required(),
    tags: Joi.array().items(Joi.string()),
  });

  const result = schmea.validate(req.body);

  if (result.error) {
    return res.status(400).json({
      message: 'bad request',
      error: result.error,
    });
  }

  const { title, body, tags } = req.body;

  try {
    const createdPost = await Post.create({
      title,
      body,
    });

    if (tags) {
      const createdTags = await Promise.all(
        tags.map((tag) => {
          return Tag.findOrCreate({
            where: {
              body: tag,
            },
          });
        }),
      );

      await createdPost.addTags(createdTags.map((v) => v[0]));
    }

    const post = await Post.findOne({
      where: {
        id: createdPost.id,
      },
      include: [
        {
          model: Tag,
          through: {
            attributes: [],
          },
        },
      ],
    });

    res.status(201).json({
      message: 'created at',
      post,
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

// eslint-disable-next-line no-unused-vars
exports.list = async (req, res, next) => {
  const page = parseInt(req.query.page || '1', 10);
  try {
    const posts = await Post.findAll({
      include: [
        {
          model: Tag,
          through: {
            attributes: [],
          },
        },
      ],
      order: [['createdAt', 'DESC']],
      limit: 10,
      offset: (page - 1) * 10,
    });

    res.json(posts);
  } catch (error) {
    console.error(error);
    next(error);
  }
};

// eslint-disable-next-line no-unused-vars
exports.read = async (req, res, next) => {
  const { id } = req.params;
  try {
    const post = await Post.findByPk(id, {
      include: {
        model: Tag,
        through: {
          attributes: [],
        },
      },
    });
    if (!post) {
      return res.status(404).json({ message: 'not found post' });
    }

    res.json(post);
  } catch (error) {
    console.error(error);
    next(error);
  }
};

exports.remove = async (req, res, next) => {
  const { id } = req.params;
  try {
    await Post.destroy({
      where: {
        id,
      },
    });
    res.json({
      message: 'deleted at',
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

exports.replace = (req, res, next) => {};

exports.update = async (req, res, next) => {
  const schmea = Joi.object().keys({
    title: Joi.string(),
    body: Joi.string(),
  });

  const result = schmea.validate(req.body);

  if (result.error) {
    return res.status(400).json({
      message: 'bad request',
      error: result.error,
    });
  }

  const { id } = req.params;

  try {
    const post = await Post.update(
      {
        ...req.body,
      },
      {
        where: {
          id,
        },
      },
    );
    if (!post) {
      return res.status(404).json({
        message: 'not found',
      });
    }

    res.json({
      message: 'updated at',
      post,
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};
