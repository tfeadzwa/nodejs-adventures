const jwt = require("jsonwebtoken");
require("dotenv").config();

const verifyJWT = (req, res, next) => {
  const authHeader = req.headers.authorization || req.header.Authorization;
  if (!authHeader?.startsWith("Bearer ")) return res.sendStatus(401); // unauthorized access
  const token = authHeader.split(" ")[1];

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decodedToken) => {
    if (err) return res.sendStatus(403); // invalid token or forbidden token
    req.user = decodedToken.UserInfo.username;
    req.roles = decodedToken.UserInfo.roles;
    next();
  });
};

module.exports = verifyJWT;
