const express = require("express");
const router = express.Router();

const { authAdminController } = require("../../controllers/admin/auth/authAdminController");
const { emailValidator, loginValidation } = require("../../validations/admin/loginValidation");

router.post("/admin/login", emailValidator(), loginValidation, authAdminController.login);

module.exports = router;
