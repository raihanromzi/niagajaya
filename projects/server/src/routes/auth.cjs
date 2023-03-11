const router = require("express").Router();
const { checkSchema } = require("express-validator");
const { register, setPassword } = require("../controllers/auth.cjs");
const {
  registerSchema,
  setPasswordSchema,
} = require("../validations/auth.cjs");

router
  .post("/register", checkSchema(registerSchema), register)
  .post("/set-password", checkSchema(setPasswordSchema), setPassword);

module.exports = router;
