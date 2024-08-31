const express = require("express");
const authentication = require("../middlewares/authentication");
const multer = require("multer");
const UserController = require("../controllers/userController");

const userRoutes = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

userRoutes.post("/login", UserController.login);
userRoutes.post("/register", UserController.register);
userRoutes.use(authentication);
userRoutes.get("/profile", UserController.getProfile);
userRoutes.put("/profile/update", UserController.updateProfile);
userRoutes.put("/profile/image", upload.single("file"), UserController.updateImage);

module.exports = userRoutes;
