const usersDB = {
  users: require("../models/users.json"),
  setUsers: function (users) {
    this.users = users;
  },
};

const fsPromises = require("fs").promises;
const bcrypt = require("bcrypt");
const path = require("path");

const handleUserLogin = async (req, res) => {
  const { user, pwd } = req.body;

  if (!user || !pwd)
    return res
      .status(400)
      .json({ message: "Usrename and password is required!" });

  const userExists = usersDB.users.find((usr) => usr.username === user);
  if (!userExists) return res.sendStatus(401);
  // evaluate password
  const match = await bcrypt.compare(pwd, userExists.password);
  if (match) {
    //create JWT
    res.status(200).json({ sucess: `User ${user} is logged in!}` });
  } else {
    res.sendStatus(401);
  }
};

module.exports = { handleUserLogin };
