const router = require("express").Router();
const { getCategories } = require("../controllers/category.cjs");

router.get("/", getCategories);

module.exports = router;
