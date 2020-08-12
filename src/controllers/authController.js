const passport = require('passport');
const Joi = require('joi');
const bcrypt = require('bcrypt');
const { User } = require('../models');

exports.register = async (req, res, next) => {
  console.log('?');
  const schema = Joi.object().keys({
    username: Joi.string().alphanum().min(3).max(20).required(),
    password: Joi.string().required(),
  });

  const result = schema.validate(req.body);
  if (result.error) {
    return res.status(400).json({
      message: 'bad request',
      error: result.error,
    });
  }

  const { username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  const existUser = await User.findOne({
    where: {
      username,
    },
  });

  if (existUser) {
    return res.status(409).json({
      message: 'already exists user',
    });
  }

  await User.create({
    username,
    hashedPassword,
  });

  res.send('crated at');
};

exports.login = async (req, res, next) => {
  const schema = Joi.object().keys({
    username: Joi.string().alphanum().min(3).max(20).required(),
    password: Joi.string().required(),
  });

  const result = schema.validate(req.body);
  if (result.error) {
    return res.status(400).json({
      message: 'bad request',
      error: result.error,
    });
  }

  passport.authenticate('local', async (err, user, info) => {
    console.log('?');
    if (err) {
      console.log(err);
      return next(err);
    }

    if (info) {
      return res.status(401).send(info.reason);
    }
    return req.login(user, async (loginError) => {
      if (loginError) {
        console.error(loginError);
        next(loginError);
      }

      const excludePasswordUser = await User.findByPk(user.id, {
        attributes: {
          exclude: ['hashedPassword'],
        },
      });

      return res.status(201).json({
        message: 'login success',
        me: excludePasswordUser,
      });
    });
  })(req, res, next);
};

exports.check = async (req, res, next) => {};

exports.logout = async (req, res, next) => {
  req.logout();
  res.send('logout');
};
