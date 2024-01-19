const usersDB = {
  users: require("../models/users.json"),
  setUsers: function (users) {
    this.users = users;
  },
};

const fsPromises = require("fs").promises;
const bcrypt = require("bcrypt");
const path = require("path");

const handleNewUser = async (req, res) => {
  const { user, pwd } = req.body;

  if (!user || !pwd)
    return res
      .status(400)
      .json({ message: `Username and password are required!` });

  //check for duplicates
  const duplicate = usersDB.users.find((usr) => usr.username === user);
  if (duplicate)
    return res
      .status(409)
      .json({ message: `Username ${duplicate.username} already exists!` }); // conflict

  try {
    // encrypt password
    const hashedPwd = await bcrypt.hash(pwd, 10);
    // store new user
    const newUser = { username: user, password: hashedPwd };
    usersDB.setUsers([...usersDB.users, newUser]);
    await fsPromises.writeFile(
      path.join(__dirname, "..", "models", "users.json"),
      JSON.stringify(usersDB.users)
    );

    console.log(usersDB.users);
    res.status(201).json({ success: `New user ${user} created successfully!` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { handleNewUser };
