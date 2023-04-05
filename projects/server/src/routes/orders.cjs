const router = require("express").Router();
const { createOrder } = require("../controllers/orders.cjs");

router.post("/", createOrder);

module.exports = router;
