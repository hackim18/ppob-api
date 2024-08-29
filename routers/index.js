const express = require("express");
const UserController = require("../controllers/userController");
const authentication = require("../middlewares/authentication");

const router = express.Router();

router.get("/", (req, res) => {
  res.send("Hello, World!");
});

router.post("/login", UserController.login);
router.post("/register", UserController.register);
router.get("/profile", authentication, UserController.getProfile);
router.put("/profile/update", authentication, UserController.updateProfile);

module.exports = router;
