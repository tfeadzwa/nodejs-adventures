const usersDB = {
  users: require("../models/users.json"),
  setUsers: function (users) {
    this.users = users;
  },
};
const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken");
require("dotenv").config();
const fsPromises = require("fs").promises;
const path = require("path");

const handleUserLogin = async (req, res) => {
  const { user, pwd } = req.body;

  if (!user || !pwd)
    return res
      .status(400)
      .json({ message: "Usrename and password is required!" });

  const foundUser = usersDB.users.find((usr) => usr.username === user);
  if (!foundUser) return res.sendStatus(401);
  // evaluate password
  const match = await bcrypt.compare(pwd, foundUser.password);
  if (match) {
    //create JWT
    const accessToken = jwt.sign(
      { username: foundUser.username },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "30s" }
    );

    const refreshToken = jwt.sign(
      { username: foundUser.username },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "1d" }
    );

    // save refresh token to the database with the current user (allows us to invalidate refresh token on logout)
    const otherUsers = usersDB.users.filter(
      (other) => other.username !== foundUser.username
    );
    const currentUser = { ...foundUser, refreshToken };
    usersDB.setUsers([...otherUsers, currentUser]);

    await fsPromises.writeFile(
      path.join(__dirname, "..", "models", "users.json"),
      JSON.stringify(usersDB.users)
    );

    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    });
    res.json({ accessToken });
  } else {
    res.sendStatus(401);
  }
};

module.exports = { handleUserLogin };
