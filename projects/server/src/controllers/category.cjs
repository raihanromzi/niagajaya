const prisma = require("../utils/client.cjs");

/** @type {Object<string, import("express").RequestHandler>} */
module.exports = {
  getCategories: async (_, res) => {
    try {
      const categories = await prisma.productCategory.findMany();
      res.send(categories);
    } catch (error) {
      console.error(error);
      res.status(400).json({
        message: error,
      });
    }
  },
};
