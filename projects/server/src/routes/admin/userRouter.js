const express = require("express");
const router = express.Router();

const userContoller = require("../../controllers/admin/userController");

// Get All Admin
router.get("/admin/admins", userContoller.getAllAdmins);

// Get ALl Warehouses Admins
router.get("/admin/warehouses-admins", userContoller.getAllWarehouseAdmins);

// Get ALl user
router.get("/admin/users", userContoller.getAllUsers);

// Create Admin
router.post("/admin/admins", userContoller.createAdmin);

// Update Admin
router.put("/admin/:adminID", userContoller.updateAdmin);

module.exports = router;
