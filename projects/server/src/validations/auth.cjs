const prisma = require("../utils/client.cjs");

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
  setPasswordSchema: {
    password: {
      isLength: {
        options: { min: 8 },
        errorMessage: "Panjang kata sandi kurang dari 8 karakter",
      },
    },
    passwordConfirm: {
      custom: {
        options: (passwordConfirm, { req }) => {
          if (passwordConfirm !== req.body.password) {
            throw new Error(
              "Konfirmasi kata sandi tidak sama dengan kata sandi"
            );
          } else {
            return true;
          }
        },
      },
    },
  },
};
