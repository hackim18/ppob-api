const express = require("express");
const userRoutes = require("./userRoutes");
const informationRoutes = require("./informationRoutes");
const transactionRoutes = require("./transactionRoutes");

const router = express.Router();

router.get("/", (req, res) => {
  res.send({ message: "PPOB API" });
});

router.use(userRoutes);
router.use(informationRoutes);
router.use(transactionRoutes);

module.exports = router;
