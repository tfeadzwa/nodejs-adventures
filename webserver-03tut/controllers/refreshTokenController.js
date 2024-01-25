const User = require("../models/User");
const jwt = require("jsonwebtoken");

const handleRefreshToken = async (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) {
    console.log("cookie property jwt is empty");
    return res.status(401).json({ message: "Cookie is empty!" });
  }
  const refreshToken = cookies.jwt;
  console.log(refreshToken);

  const foundUser = await User.findOne({ refreshToken }).exec();
  if (!foundUser) {
    console.log("Couldn't find user");
    return res.sendStatus(403);
  } // forbidden

  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    (err, decodedToken) => {
      if (err || foundUser.username !== decodedToken.username) {
        return res.sendStatus(403);
      }

      const roles = Object.values(foundUser.roles);
      const accessToken = jwt.sign(
        {
          UserInfo: {
            username: decodedToken.username,
            roles: roles,
          },
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "45s" }
      );

      res.json({ accessToken });
    }
  );
};

module.exports = { handleRefreshToken };
