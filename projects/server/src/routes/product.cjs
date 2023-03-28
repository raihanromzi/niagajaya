const router = require("express").Router();

const {
  getProducts,
  getProduct,
  getTotalPage,
} = require("../controllers/product.cjs");

router.get("/", getProducts);
router.get("/v2", getTotalPage);
router.get("/v3/:id", getProduct);

module.exports = router;
