const express = require("express");
const authentication = require("../middlewares/authentication");
const TransactionController = require("../controllers/transactionController");

const transactionRoutes = express.Router();

transactionRoutes.use(authentication);
transactionRoutes.get("/balance", TransactionController.getBalance);
transactionRoutes.post("/topup", TransactionController.topupBalance);
transactionRoutes.post("/transaction", TransactionController.payTransaction);
transactionRoutes.get("/transaction/history", TransactionController.getTransactionHistory);

module.exports = transactionRoutes;
