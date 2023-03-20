const prisma = require("../../utils/client.cjs");
const response = require("../../utils/responses");

const authAdminController = {
  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await prisma.user.findFirst({
        where: { email, hashedPassword: password, OR: [{ role: "ADMIN" }, { role: "MANAGER" }] },
      });

      if (!user) {
        return res.status(400).send.json({
          message: "Please try again. Email and Password does not match",
        });
      }

      res.send({
        result: { id: user.id },
        message: "Login success",
      });
    } catch (e) {
      res.status(500).send(response.responseError("500", "SERVER_ERROR", { message: "Email and Password does not match" }));
    }
  },
};

module.exports = {
  authAdminController,
};
