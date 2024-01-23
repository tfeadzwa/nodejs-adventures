const usersDB = {
  users: require("../models/users.json"),
  setUsers: function (users) {
    this.users = users;
  },
};

const jwt = require("jsonwebtoken");
require("dotenv").config();

const handleRefreshToken = (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) {
    console.log("cookie property jwt is empty");
    return res.status(401).json({ message: "Cookie is empty!" });
  }
  const refreshToken = cookies.jwt;
  console.log(refreshToken);

  const foundUser = usersDB.users.find(
    (user) => user.refreshToken === refreshToken
  );
  if (!foundUser) return res.sendStatus(403); // forbidden

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
        { expiresIn: "30s" }
      );

      res.json({ accessToken });
    }
  );
};

module.exports = { handleRefreshToken };
