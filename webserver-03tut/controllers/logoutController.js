const usersDB = {
  users: require("../models/users.json"),
  setUsers: function (users) {
    this.users = users;
  },
};

const fsPromises = require("fs").promises;
const path = require("path");

const handleUserLogout = async (req, res) => {
  // On client also delete the access token

  const cookies = req.cookies;
  if (!cookies?.jwt)
    return res.status(204).json({ message: "No content found!" }); // no content
  const refreshToken = cookies.jwt;

  const foundUser = usersDB.users.find(
    (user) => user.refreshToken === refreshToken
  );
  if (!foundUser) {
    res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });
    return res.status(204).json({ message: "User not found!" });
  }

  const otherUsers = usersDB.users.filter(
    (user) => user.refreshToken !== refreshToken
  );
  const currentUser = { ...foundUser, refreshToken: "" };
  usersDB.setUsers([...otherUsers, currentUser]);
  await fsPromises.writeFile(
    path.join(__dirname, "..", "models", "users.json"),
    JSON.stringify(usersDB.users)
  );

  res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });
  res.status(204).json("message: User logged out!");
};

module.exports = { handleUserLogout };
