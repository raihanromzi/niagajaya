const { validationResult } = require("express-validator");
const prisma = require("../utils/client.cjs");

/** @type {Object<string, import("express").RequestHandler>} */
module.exports = {
  getProductCategories: async () => {},
  createProductCategory: async (req, res) => {
    try {
      validationResult(req).throw();

      const { name } = req.body;

      await prisma.productCategory.create({ data: { name } });

      res.json({ success: true, msg: "Kategori produk baru berhasil dibuat!" });
    } catch (err) {
      const errors = "errors" in err ? err.mapped() : { unknown: err };
      res.status(400).json({
        success: false,
        errors,
      });
    }
  },
};
