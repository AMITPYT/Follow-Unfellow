const User = require("../Models/Registeration");
const bcrypt = require("bcrypt");
const express = require("express");
const router = express.Router();
var jwt = require("jsonwebtoken");
const fetchuser = require("../middleware/fetchuser");

const JWT_SECRET = "Amitisagoodb$oy";
router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const emailCheck = await User.findOne({ email });
    if (emailCheck)
      return res.json({ msg: "Email already used", status: false });
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      email,
      username,
      password: hashedPassword,
    });
    delete user.password;
    const data = {
      user: {
        id: user.id,
      },
    };
    const authtoken = jwt.sign(data, JWT_SECRET);

    success = true;
    return res.json({
      msg: "Account Registered Successfully",
      authtoken,
      user,
    });
  } catch (error) {
    console.error(error.message);
    res.status(400).send(error);
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.json({ msg: "Incorrect Email Id", status: false });
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid)
      return res.json({ msg: "Incorrect Password", status: false });
    const data = {
      user: {
        id: user.id,
      },
    };
    const authtoken = jwt.sign(data, JWT_SECRET);

    success = true;
    return res.json({
      
      msg: "Loged In Successfully",
      authtoken,
      user,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal server error");
  }
});
router.get("/getuser/:id", async (req, res) => {
  try {
    // user = req.params.id;
    const user = await User.findById(req.params.id);
    res.send(user);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal server error");
  }
});
router.get("/getuser", fetchuser, async (req, res) => {
  try {
    // user = req.params.id;
    const user = await User.find();
    res.send(user);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal server error");
  }
});

module.exports = router;
