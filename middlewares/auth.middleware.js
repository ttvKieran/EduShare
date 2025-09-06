const User = require("../models/users.model");
const authMethodHelper = require("../helpers/authMethode");
const redis = require("../configs/connection_redis_online");
exports.isAuth = async (req, res, next) => {
  try {
    const accessTokenFromHeader = req.headers.authorization.split(" ")[1];
    if (!accessTokenFromHeader) {
      return res.status(401).json({ message: 'Access token required!' });
    }
    const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
    const verified = await authMethodHelper.verifyToken(
      accessTokenFromHeader,
      accessTokenSecret,
    );
    if (!verified) {
      return res
        .status(401)
        .json({ message: 'Verifie accessToken failed!' });
    }
    // const cacheKey = `user:${verified.payload || ''}`;
    // console.log(cacheKey);
    var user = await User.findOne({ _id: verified.payload });
    // check if user exists
    if (!user) {
      res.status(404).json({ message: "User don't exists" });
    }
    // const ttl = verified.exp - Math.floor(Date.now() / 1000);
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: "Not authorized, token failed!" });
  }
};