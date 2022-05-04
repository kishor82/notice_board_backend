const jwt = require('jsonwebtoken');
const keys = require('../config/keys');

function authorization(req, res, next) {
  const token = req.cookies.access_token;
  if (!token) {
    return res.sendStatus(403);
  }
  try {
    const data = jwt.verify(token, keys.secretOrKey);
    req.authUser = data;
    return next();
  } catch {
    return res.sendStatus(403);
  }
}

module.exports = authorization;
