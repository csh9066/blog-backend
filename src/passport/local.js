const passport = require('passport');
const LocalStrategy = require('passport-local');
const { User } = require('../models');

module.exports = () => {
  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        const user = await User.findOne({
          where: {
            username,
          },
        });

        const isMatchPassword = await user.checkPassword(password);

        if (!user || !isMatchPassword) {
          return done(null, false, { reason: 'not found user' });
        }

        return done(null, user);
      } catch (error) {
        console.error(error);
        return done(error);
      }
    }),
  );
};
