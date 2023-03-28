const router = require("express").Router();
const { checkSchema } = require("express-validator");
const uniqueNameSchema = require("../validations/uniqueName.cjs");

router
  .get("/")
  .get("/:id")
  .post("/", checkSchema(uniqueNameSchema))
  .put("/:id");

module.exports = router;
