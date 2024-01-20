const jwt = require("jsonwebtoken");
require("dotenv").config();

const verifyJWT = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) return res.sendStatus(401); // unauthorized access
  const token = authHeader.split(" ")[1];
  console.log(authHeader);

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decodedToken) => {
    if (err) return res.sendStatus(403); // invalid token or forbidden token
    req.user = decodedToken.username;
    next();
  });
};

module.exports = verifyJWT;
