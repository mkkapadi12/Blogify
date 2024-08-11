const { Router } = require("express");
const USER = require("../models/user");

const router = Router();

router.get("/signin", (req, res) => {
  res.render("signin");
});

router.get("/signup", (req, res) => {
  res.render("signup");
});

router.get("/logout", (req, res) => {
  res.clearCookie("token").redirect("/");
});

router.post("/signin", async (req, res) => {
  const { email, password } = req.body;

  try {
    const token = await USER.matchPasswordAndGenerateToken(email, password);
    // console.log("Token : ", token);
    res.cookie("token", token).redirect("/");
  } catch (error) {
    return res.render("signin", {
      error: "Incorrect email or password",
    });
  }
});

router.post("/signup", async (req, res) => {
  const { fullName, email, password } = req.body;

  await USER.create({
    fullName,
    email,
    password,
  });

  res.redirect("/user/signin");
});

module.exports = router;
