const { PrismaClient } = require("@prisma/client");
const response = require("../../utils/responses");

const authAdminController = {
  login: async (req, res) => {
    try {
      const { email } = req.body;
      const user = await prisma.user.findFirst({
        where: { email: email },
      });

      if (!user) {
        return res.status(400).send.json({
          message: "Email and Password does not match",
        });
      }

      res.send({
        result: { id: user.id },
        message: "Login success",
      });
    } catch (e) {
      res.status(500).send(response.responseError("500", "SERVER_ERROR", "bodo"));
    }
  },
};

module.exports = {
  authAdminController,
};
