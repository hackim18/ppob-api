const express = require("express");
const userRoutes = require("./userRoutes");

const router = express.Router();

router.get("/", (req, res) => {
  res.send({ message: "PPOB API" });
});

router.use(userRoutes);

module.exports = router;
