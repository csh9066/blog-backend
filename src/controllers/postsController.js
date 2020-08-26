const { Post, Tag, User } = require('../models');
const Joi = require('joi');
const { Op } = require('sequelize');

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
      UserId: req.user.id,
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

    res.status(201).json(post);
  } catch (error) {
    console.error(error);
    next(error);
  }
};

// eslint-disable-next-line no-unused-vars
exports.list = async (req, res, next) => {
  const { page, tag, username } = req.query;
  const parsedIntPage = parseInt(page || '1', 10);
  let where = {};

  try {
    if (tag) {
      const tags = await Tag.findAll({
        where: {
          body: tag,
        },
        include: {
          model: Post,
        },
        attributes: [],
      });
      let ids = [];
      if (tags[0]) {
        ids = tags[0].Posts.map((post) => post.id);
      }
      where.id = { [Op.in]: ids };
    }

    // if (username) {
    //   where.PostId = username;
    // }
    // console.log(where);
    const posts = await Post.findAll({
      where,
      include: [
        {
          model: Tag,
          through: {
            attributes: [],
          },
        },
        {
          model: User,
          attributes: ['id', 'username'],
        },
      ],
      order: [['createdAt', 'DESC']],
      limit: 10,
      offset: (parsedIntPage - 1) * 10,
    });
    const totalPostsCouunt = await Post.count();
    const lastPage = Math.ceil(totalPostsCouunt / 10) || 1;
    console.log(lastPage);
    res.set('last-page', `${lastPage}`);
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
      include: [
        {
          model: Tag,
          through: {
            attributes: [],
          },
        },
        {
          model: User,
          attributes: ['username'],
        },
      ],
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
    tags: Joi.array().items(Joi.string()),
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
    const post = await Post.findByPk(id);

    if (!post) {
      return res.status(404).json({
        message: 'not found',
      });
    }

    await post.update({
      ...req.body,
    });

    if (req.body.tags) {
      const createdTags = await Promise.all(
        req.body.tags.map((tag) => {
          return Tag.findOrCreate({
            where: {
              body: tag,
            },
          });
        }),
      );
      await post.setTags(createdTags.map((v) => v[0]));
    }

    res.json(post);
  } catch (error) {
    console.error(error);
    next(error);
  }
};
