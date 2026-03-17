const UnauthorizedError = require("../errors/unauthorized");
const jwt = require("jsonwebtoken");
const config = require("../config");
const User = require("../api/users/users.model");

module.exports = async (req, res, next) => {
  try {
    const token = req.headers["x-access-token"];
    if (!token) {
      throw "not token";
    }
    const decoded = jwt.verify(token, config.secretJwtToken);
    // on récupère toutes les infos de l'utilisateur (pas juste l'id)
    const user = await User.findById(decoded.userId, "-password");
    if (!user) {
      throw "user not found";
    }
    // on passe l'utilisateur complet dans req (avec son role, email, etc)
    req.user = {
      userId: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    };
    next();
  } catch (message) {
    next(new UnauthorizedError(message));
  }
};
