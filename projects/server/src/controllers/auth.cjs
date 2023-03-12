const bcrypt = require("bcrypt");
const { validationResult } = require("express-validator");
const { randomUUID } = require("crypto");
const prisma = require("../utils/client.cjs");
const redis = require("../utils/redis.cjs");
const sendMail = require("../utils/sendMail.cjs");

const passwordPrefix = "pass:";

/** @type {Object<string, import("express").RequestHandler>} */
module.exports = {
  register: async (req, res) => {
    try {
      validationResult(req).throw();

      const { email, name } = req.body;
      const user = await prisma.user.create({
        data: {
          email,
          role: "USER",
          names: { create: { name } },
        },
        include: { names: true },
      });

      const code = randomUUID();

      await redis.set(passwordPrefix + code, user.id, "EX", 86400); // 24 hours

      await sendMail(
        email,
        "Verifkasi Akun",
        `<a href="http://localhost:5173/set-password/${code}">Setel Kata Kunci</a>`
      );

      res.json({ success: true, msg: "Pendaftaran berhasil!" });
    } catch (err) {
      const errors = "errors" in err ? err.mapped() : { unknown: err };
      res.status(400).json({
        success: false,
        errors,
      });
    }
  },
  setPassword: async (req, res) => {
    try {
      validationResult(req).throw();

      const { password, code } = req.body;

      const id = +(await redis.getdel(passwordPrefix + code));
      if (!id) throw new Error("Kode tak sah");

      const hashedPassword = await bcrypt.hash(password, 10);

      await prisma.user.update({
        where: { id },
        data: { hashedPassword },
      });

      res.json({ success: true, msg: "Kata kunci berhasil tersetel!" });
    } catch (err) {
      const errors = "errors" in err ? err.mapped() : { unknown: err };
      res.status(400).json({
        success: false,
        errors,
      });
    }
  },
};
