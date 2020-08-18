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
        if (!user) {
          return done(null, false, { reason: 'not found user' });
        }
        const isMatchPassword = await user.checkPassword(password);

        if (!isMatchPassword) {
          return done(null, false, { reason: 'dont matching password' });
        }

        return done(null, user);
      } catch (error) {
        console.error(error);
        return done(error);
      }
    }),
  );
};
