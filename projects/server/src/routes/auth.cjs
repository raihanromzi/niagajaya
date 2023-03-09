const router = require("express").Router();
const { register, verify } = require("../controllers/auth.cjs");
const { body, validationResult } = require("express-validator");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

router
  .post(
    "/register",
    [
      body("email")
        .isEmail()
        .normalizeEmail()
        .custom(async (value) => {
          const user = await prisma.user.findUnique({
            where: { email: value },
          });
          if (user) {
            return Promise.reject("Alamat surel sudah terpakai");
          }
        }),
    ],
    register
  )
  .post(
    "/verify",
    [
      body("password")
        .isLength({ min: 8 })
        .custom(
          (value, { req }) =>
            // if (value !== req.body.passwordConfirm) {
            //   throw new Error("");
            // } else return true;
            value === req.body.passwordConfirm ||
            (() => {
              throw new Error(
                "Kata kunci tidak sama dengan konfirmasi kata kunci"
              );
            })()
        ),
    ],
    verify
  );

module.exports = router;
