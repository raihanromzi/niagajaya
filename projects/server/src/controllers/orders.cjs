const prisma = require("../utils/client.cjs");

/** @type {Object<string, import("express").RequestHandler>} */
module.exports = {
  createOrder: async (req, res) => {
    try {
      const {
        addressId,
        shipmentMethod,
        shipmentPrice,
        userId,
        warehouseId,
        products,
      } = req.body;

      const { detail, street, city, province, postalCode } =
        await prisma.userAddress.findUniqueOrThrow({
          where: { id: +addressId },
        });

      await prisma.order.create({
        data: {
          status: "UNSETTLED",
          userAddressFull: `${detail} ${street}, ${city}, ${province} ${postalCode}`,
          shipmentMethod,
          shipmentPrice: +shipmentPrice,
          user: { connect: { id: +userId } },
          warehouse: { connect: { id: +warehouseId } },
          details: {
            createMany: {
              data: products.map(({ id, quantity, priceRupiahPerUnit }) => ({
                productId: +id,
                quantity: +quantity,
                priceRupiahPerUnit: +priceRupiahPerUnit,
              })),
            },
          },
        },
      });

      res.json({ success: true });
    } catch (err) {
      res.status(400).json({ success: false, errors: { unknown: err } });
    }
  },
};
