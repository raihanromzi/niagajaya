const prisma = require("../../utils/client.cjs");
const response = require("../../utils/responses");
const bcrypt = require("bcrypt");

const authAdminController = {
  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      // Check Email
      const user = await prisma.user.findFirst({
        where: { email, OR: [{ role: "ADMIN" }, { role: "MANAGER" }] },
        select: {
          id: true,
          email: true,
          hashedPassword: true,
          role: true,
          imageUrl: true,
          token: true,
        },
      });
      if (!user) {
        res.status(400).send(response.responseError(400, "BAD REQUEST", { message: "Email Not Found!" }));
        return;
      }

      // Compare Password
      const isPasswordValid = await bcrypt.compare(password, user.hashedPassword);
      if (!isPasswordValid) {
        res.status(400).send(response.responseError(400, "BAD REQUEST", { message: "Email and Password Does Not Match!" }));
        return;
      }

      // Create Session
      const userx = { id: user.id };
      req.session.user = userx;

      res.status(200).send(
        response.responseSuccess(200, "SUCCESS", {
          id: user.id,
          email: user.email,
          role: user.role,
          imageUrl: user.imageUrl,
          token: user.token,
        })
      );
      return;
    } catch (e) {
      console.log(e);
      res.status(500).send(response.responseError(500, "SERVER_ERROR", `${e}`));
    }
  },
};

module.exports = {
  authAdminController,
};
