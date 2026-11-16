const bcrypt = require("bcryptjs");
const User = require("../models/user");

// GET Register
exports.getRegister = (req, res) => {
  res.render("auth/register");
};

// POST Register
exports.postRegister = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.send("Email already registered.");
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = new User({
      fullName,
      email,
      password: hashedPassword
    });

    await user.save();

    res.redirect("/login");
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).send("Something went wrong.");
  }
};

// GET Login
exports.getLogin = (req, res) => {
  res.render("auth/login");
};

// POST Login
exports.postLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.send("Invalid email or password.");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.send("Invalid email or password.");
    }

    req.session.user = {
      id: user._id.toString(),
      fullName: user.fullName,
      email: user.email
    };

    req.session.save((error) => {
      if (error) {
        console.error("Session save error:", error);
        return res.status(500).send("Could not create login session.");
      }

      res.redirect("/");
    });

  } catch (error) {
    console.error("Login error:", error);
    res.status(500).send("Something went wrong.");
  }
};
// Logout
exports.logout = (req, res) => {
  req.session.destroy((error) => {
    if (error) {
      console.error("Logout error:", error);
      return res.status(500).send("Could not logout.");
    }

    res.redirect("/");
  });
};