const jwt = require("jsonwebtoken");
const config = require("config");

module.exports = function (req, res, next) {
  //get token from heder
  const token = req.header("x-auth-token");

  //Check if token exist
  if (!token) {
    return res.status(401).json({ mag: "No token, authorazation denied" });
  }

  //verify token
  try {
    const decode = jwt.verify(token, config.get("jwtSecret"));
    req.user = decode.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: "token not found" });
  }
};
