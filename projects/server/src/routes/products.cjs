const router = require("express").Router();
const { checkSchema } = require("express-validator");
const uniqueNameSchema = require("../validations/uniqueName.cjs");
const { createProductCategory } = require("../controllers/products.cjs");

router.get("/").post("/", checkSchema(uniqueNameSchema), createProductCategory);

module.exports = router;
