const router = require("express").Router();

const { getProducts, getTotalPage } = require("../controllers/product.cjs");

router.get("/", getProducts);
router.get("/v2", getTotalPage);

module.exports = router;
