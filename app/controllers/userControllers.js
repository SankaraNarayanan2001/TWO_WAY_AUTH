const speakeasy = require("speakeasy");
const User = require("../model/userModel");
const bcrypt = require("bcrypt");

const welcome = (req, res) => {
  res.json({ message: "Welcome to the two-factor authentication example" });
};

const signup = async (req, res) => {
  try {
    const password = await bcrypt.hash(req.body.password, 10);
    const newUser = await User.create({
      ...req.body,
      password,
    });
    res.json({ data: newUser });
  } catch (error) {
    console.error("Error generating secret key:", error);
    res.status(500).json({ message: "Error generating secret key" });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const tempSecret = speakeasy.generateSecret();
  try {
    // Retrieve user from the database
    const user = await User.findOne({ where: { email } });
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    const hashedPassword = await bcrypt.compare(password, user.password);
    console.log(hashedPassword);
    if (!hashedPassword) {
      return res.status(500).json({ message: "Incorrect password" });
    }

    user.secret = tempSecret.base32;
    await user.save();
    res.status(200).json({ status: "success", toekn: user.secret });
  } catch (error) {
    console.error("Error retrieving user:", error);
    res.status(500).json({ message: "Error retrieving user" });
  }
};

const validate = async (req, res) => {
  const { id, token } = req.body;
  try {
    // Retrieve user from the database
    const user = await User.findByPk(id);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const { secret } = user;
    console.log(secret);

    // Validate the token
    const tokenValidates = speakeasy.totp.verify({
      secret,
      encoding: "base32",
      token,
      window: 1,
    });

    if (tokenValidates) {
      res.json({ validated: true });
    } else {
      res.json({ validated: false });
    }
  } catch (error) {
    console.error("Error retrieving user:", error);
    res.status(500).json({ message: "Error retrieving user" });
  }
};

module.exports = { welcome, signup, login, validate };
