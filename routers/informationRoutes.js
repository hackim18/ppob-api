const express = require("express");
const authentication = require("../middlewares/authentication");
const InformationController = require("../controllers/informationController");

const informationRoutes = express.Router();

informationRoutes.use(authentication);
informationRoutes.get("/banner", InformationController.getAllBanners);
informationRoutes.get("/services", InformationController.getAllServices);

module.exports = informationRoutes;
