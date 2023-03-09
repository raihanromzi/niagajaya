const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require("bcrypt");

/** @type {Object.<string, import("express").RequestHandler>} */
module.exports = {
  register: async (req, res) => {
    try {
      const user = await prisma.user.create({
        data: {
          email: req.body.email,
          role: "USER",
          setPasswordCode: crypto.randomUUID(),
        },
      });
      res.send(user);
    } catch (err) {
      res.send(err);
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
