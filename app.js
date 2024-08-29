require("dotenv").config();
const express = require("express");
const errorHandling = require("./middlewares/errorHandling");
const router = require("./routers");

const app = express();

app.get("/", (req, res) => {
  res.send({ message: "Hello World!" });
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(router);
app.use(errorHandling);

module.exports = app;
