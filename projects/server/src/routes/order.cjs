const router = require("express").Router();

const { getOrders, getTotalPage } = require("../controllers/order.cjs");

router.get("/", getOrders);
router.get("/v2", getTotalPage);

module.exports = router;
