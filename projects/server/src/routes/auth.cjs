const router = require("express").Router();
const { checkSchema } = require("express-validator");
const { registerSchema, verifySchema } = require("../validations/auth.cjs");
const { register, verify } = require("../controllers/auth.cjs");

router
  .post("/register", checkSchema(registerSchema), register)
  .post("/verify", checkSchema(verifySchema), verify);

module.exports = router;
