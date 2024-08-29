const express = require("express");
const UserController = require("../controllers/userController");

const router = express.Router();

router.get("/", (req, res) => {
  res.send("Hello, World!");
});

router.use("/login", UserController.login);
router.use("/register", UserController.register);

module.exports = router;
