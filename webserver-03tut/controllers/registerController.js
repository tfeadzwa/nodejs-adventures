const User = require("../models/User");
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
  const duplicate = await User.findOne({ username: user }).exec();
  if (duplicate)
    return res
      .status(409)
      .json({ message: `Username ${duplicate.username} already exists!` }); // conflict

  try {
    // encrypt password
    const hashedPwd = await bcrypt.hash(pwd, 10);
    // create new user
    const newUser = await User.create({
      username: user,
      password: hashedPwd,
    });

    console.log(newUser);
    res.status(201).json({ success: `New user ${user} created successfully!` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { handleNewUser };
