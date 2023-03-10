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
      isAlpha: {
        errorMessage: "Kolom nama hanya boleh mengandung huruf atau spasi",
        options: ["en-US", { ignore: /\s/g }],
      },
      isLength: {
        options: { max: 255 },
        errorMessage: "Kolom nama tidak boleh melebihi 255 karakter",
      },
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
