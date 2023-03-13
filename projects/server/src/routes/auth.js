const express = require("express");
const router = express.Router();

const { authController } = require("../controllers");
const { validate, loginValidator } = require("../middlewares/validator");

router.post("/v2", loginValidator(), validate, authController.login);
router.get("/v3", authController.check);

module.exports = router;
