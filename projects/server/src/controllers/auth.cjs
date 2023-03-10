const bcrypt = require("bcrypt");
const { validationResult } = require("express-validator");
const { randomUUID } = require("crypto");
const prisma = require("../client.cjs");

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
          setPasswordCode: { create: { code: randomUUID() } },
        },
        include: { names: true, setPasswordCode: true },
      });
      res.json({ success: true, msg: "Pendaftaran berhasil", user });
    } catch (err) {
      const errObj = "errors" in err ? { errors: err.array() } : err;
      console.error(errObj);
      res.status(400).json({
        success: false,
        ...errObj,
      });
    }
  },
  verify: async (req, res, next) => {
    try {
      const { password } = req.body;
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await prisma.user.update({
        where: {},
        data: { hashedPassword },
      });
      res.send(user);
    } catch (err) {
      res.send(err);
    }
  },
};
