const express = require("express");
const multer = require("multer");
const UserController = require("../controllers/userController");
const authentication = require("../middlewares/authentication");
const InformationController = require("../controllers/informationController");
const TransactionController = require("../controllers/transactionController");

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.get("/", (req, res) => {
  res.send({ message: "PPOB API" });
});

router.post("/login", UserController.login);
router.post("/register", UserController.register);
router.use(authentication);
router.get("/profile", UserController.getProfile);
router.put("/profile/update", UserController.updateProfile);
router.put("/profile/image", upload.single("file"), UserController.updateImage);

router.get("/banner", InformationController.getAllBanners);
router.get("/services", InformationController.getAllServices);

router.get("/balance", TransactionController.getBalance);
// router.post("/topup", TransactionController.topup);
// router.post("/transaction", TransactionController.transaction);
// router.post("/transaction/history", TransactionController.transactionHistory);

module.exports = router;
