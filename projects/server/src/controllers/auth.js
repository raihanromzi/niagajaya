const { PrismaClient } = require("@prisma/client");
const axios = require("axios");
const { default: RedisStore } = require("connect-redis");
const redis = require("../utils/redis.cjs");

const prisma = new PrismaClient();
const store = new RedisStore({ client: redis });

const authController = {
  login: async (req, res) => {
    try {
      const { email } = req.body;
      const user = await prisma.user.findFirst({
        where: { email: email },
      });

      // const isValid = await bcrypt.compare(password, user.password);
      // if (!isValid) {
      //   return res.status(400).json({
      //     message: "Email and Password does not match",
      //   });
      // }
      if (!user) {
        return res.status(400).json({
          message: "Email and Password does not match",
        });
      }

      const userx = { id: user.id };
      req.session.user = userx;

      res.send({
        result: { id: user.id },
        message: "Login success with Session",
      });
    } catch (error) {
      console.log(error);
      res.status(400).json({
        message: error,
      });
    }
  },

  check: async (req, res) => {
    try {
      if (!req.session) {
        return res.status(404).send("Session not found");
      } else {
        return res.send({ result: { id: req.session.user?.id } });
      }
    } catch (error) {
      console.log(error);
      res.status(400).json({
        message: error,
      });
    }
  },
};

module.exports = authController;

// const redis = require('redis');
// const client = redis.createClient();
// const session = require('express-session');
// const RedisStore = require('connect-redis')(session);

// const store = new RedisStore({ client });

// function deleteSessionsForUser(userId) {
//   store.all((err, sessions) => {
//     if (err) {
//       console.error('Error getting all sessions:', err);
//       return;
//     }
//     sessions.forEach((session) => {
//       if (session.userId === userId) {
//         store.destroy(session.id, (err) => {
//           if (err) {
//             console.error('Error destroying session:', err);
//           }
//         });
//       }
//     });
//   });
// }

// // Example usage:
// deleteSessionsForUser('user123');
