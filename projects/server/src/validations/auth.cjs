const prisma = require("../client.cjs");

/** @type {Object<string, import("express-validator").Schema>} */
module.exports = {
  registerSchema: {
    email: {
      isEmail: { errorMessage: "Alamat surel tidak sah", bail: true },
      normalizeEmail: true,
      custom: {
        options: async (email) => {
          const user = await prisma.user.findUnique({ where: { email } });
          if (user) {
            throw new Error("Alamat surel sudah terpakai");
          }
        },
      },
    },
    name: {
      isAlphanumeric: {
        errorMessage:
          "Kolom nama hanya boleh mengandung huruf, angka, atau spasi",
        options: ["en-US", { ignore: /\s/g }],
      },
      isLength: { options: { max: 255 } },
    },
  },
  verifySchema: {
    password: {
      // isStrongPassword: { errorMessage: "Kata sandi lemah" },
      custom: {
        options: (password, { req }) => {
          if (password !== req.body.passwordConfirm) {
            throw new Error(
              "Kata sandi tidak sama dengan konfirmasi kata sandi"
            );
          }
        },
      },
    },
  },
};
