const router = require("express").Router();
const { checkSchema } = require("express-validator");
const {
  register,
  setPassword,
  check,
  login,
} = require("../controllers/auth.cjs");
const {
  registerSchema,
  setPasswordSchema,
} = require("../validations/auth.cjs");

const { validate, loginValidator } = require("../validations/login.cjs");

router
  .post("/register", checkSchema(registerSchema), register)
  .post("/set-password", checkSchema(setPasswordSchema), setPassword);

router.post("/v2", loginValidator(), validate, login);
router.get("/v3", check);

module.exports = router;
