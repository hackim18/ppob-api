const express = require("express");
const multer = require("multer");
const UserController = require("../controllers/userController");
const authentication = require("../middlewares/authentication");

const userRoutes = express.Router();

userRoutes.post("/login", UserController.login);
userRoutes.post("/register", UserController.register);
userRoutes.use(authentication);
userRoutes.get("/profile", UserController.getProfile);
userRoutes.put("/profile/update", UserController.updateProfile);

const upload = multer({ storage: multer.memoryStorage() });
userRoutes.put("/profile/image", upload.single("file"), UserController.updateImage);

module.exports = userRoutes;
