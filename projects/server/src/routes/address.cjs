const router = require("express").Router();

const {
  getProvinces,
  getCitys,
  getAddress,
  getAddresses,
  createAddress,
  updateAddress,
  deleteAddress,
} = require("../controllers/address.cjs");

router.get("/", getAddresses);
router.post("/", createAddress);

router.get("/:id", getAddress);
router.delete("/:id", deleteAddress);
router.put("/:id", updateAddress);

router.get("/v1/province", getProvinces);
router.get("/v1/city", getCitys);

module.exports = router;
