const { body, validationResult } = require("express-validator");
const response = require("../../utils/responses");

const emailValidator = () => {
  return [body("email").isEmail().withMessage("bukan email")];
};

const loginValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).send(response.responseError(400, "BAD REQUEST", "Email not Valid!"));
  }
  return next();
};

module.exports = {
  emailValidator,
  loginValidation,
};
