const express = require("express");
const router = express.Router();

const { addressController } = require("../controllers");

router.post("/", addressController.createAddress);
router.get("/", addressController.getAddresses);

router.get("/:id", addressController.getAddress);
router.delete("/:id", addressController.deleteAddress);
router.put("/:id", addressController.updateAddress);

router.get("/v1/province", addressController.getProvinces);
router.get("/v1/city", addressController.getCitys);

module.exports = router;
