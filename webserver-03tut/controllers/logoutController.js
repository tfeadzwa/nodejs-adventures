const User = require("../models/User");

const handleUserLogout = async (req, res) => {
  // On client also delete the access token

  const cookies = req.cookies;
  if (!cookies?.jwt)
    return res.status(204).json({ message: "No content found!" }); // no content
  const refreshToken = cookies.jwt;

  const foundUser = await User.findOne({ refreshToken }).exec();
  if (!foundUser) {
    res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });
    return res.status(204).json({ message: "User not found!" });
  }

  foundUser.refreshToken = "";
  const result = await foundUser.save();
  console.log(result);

  res.clearCookie("jwt", { httpOnly: true, sameSite: "None" });
  res.status(204).json("message: User logged out!");
};

module.exports = { handleUserLogout };
