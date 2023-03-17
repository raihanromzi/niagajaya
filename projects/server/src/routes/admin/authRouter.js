const express = require("express");
const router = express.Router();

const { authAdminController } = require("../../controllers/admin/authAdmin");

router.post("/admin/login/", authAdminController.login);

module.exports = router;
