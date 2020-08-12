module.exports = function isLoggedIn(req, res, next) {
  if (!req.user) {
    return res.status(401).send('Unauthorized');
  }
  return next();
};
