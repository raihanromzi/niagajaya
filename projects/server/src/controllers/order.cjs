const prisma = require("../utils/client.cjs");

/** @type {Object<string, import("express").RequestHandler>} */
module.exports = {
  getOrders: async (req, res) => {
    try {
      if (!req.session.user) {
        return res.status(400).json({
          message: "Harus login",
        });
      }

      const {
        warehouseName,
        productName,
        page = 1,
        size = 1,
        sortBy = "latest",
        status = "UNSETTLED",
      } = req.query;
      const skip = (page - 1) * size;

      let orderBy;
      switch (sortBy) {
        case "latest":
          orderBy = { createdAt: "desc" };
          break;
        case "oldest":
          orderBy = { createdAt: "asc" };
          break;
        default:
          orderBy = { createdAt: "desc" };
          break;
      }
      const where = {};
      where.AND = [{ status: status }];

      const user = prisma.user.findFirst({
        where: { id: req.session.user.id },
      });

      if (user.role === "USER") {
        return res.status(400).json({
          message: "Anda tidak memiliki otoritas untuk mengakses data ini",
        });
      }

      if (user.role === "MANAGER") {
        const warehouse = await prisma.warehouse.findMany({
          where: {
            managerId: user.id,
          },
        });
        where.AND.push({
          warehouseId: warehouse.id,
        });
      }

      if (warehouseName) {
        where.OR = [{ warehouse: { name: { contains: warehouseName } } }];
      } else if (productName) {
        where.OR = [
          {
            details: {
              some: { product: { name: { contains: productName } } },
            },
          },
        ];
      }
      const orders = await prisma.order.findMany({
        where,
        select: {
          id: true,
          userAddressFull: true,
          paymentImageUrl: true,
          shipmentPrice: true,
          shipmentMethod: true,
          status: true,
          createdAt: true,

          warehouse: {
            select: {
              name: true,
            },
          },
          details: {
            select: {
              productId: true,
              quantity: true,
              priceRupiahPerUnit: true,
              product: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
        skip: parseInt(skip),
        take: parseInt(size),
        orderBy: orderBy,
      });

      const ordersWithTotalCost = orders.map((order) => {
        const subTotal = order.details.reduce(
          (acc, cur) => acc + cur.quantity * cur.priceRupiahPerUnit,
          0
        );
        const totalCost = subTotal + order.shipmentPrice;
        return { ...order, subTotal, totalCost };
      });

      res.send(ordersWithTotalCost);
    } catch (error) {
      console.error(error);
      res.status(400).json({
        message: error,
      });
    }
  },
  getTotalPage: async (req, res) => {
    try {
      if (!req.session.user) {
        return res.status(400).json({
          message: "Harus login",
        });
      }

      const {
        warehouseName,
        productName,
        status = "UNSETTLED",
        size = 1,
      } = req.query;

      const where = {};
      where.AND = [{ status: status }];

      const user = prisma.user.findFirst({
        where: { id: req.session.user.id },
      });

      if (user.role === "USER") {
        return res.status(400).json({
          message: "Anda tidak memiliki otoritas untuk mengakses data ini",
        });
      }

      if (user.role === "MANAGER") {
        const warehouse = await prisma.warehouse.findMany({
          where: {
            managerId: user.id,
          },
        });
        where.AND.push({
          warehouseId: warehouse.id,
        });
      }

      if (warehouseName) {
        where.OR = [{ warehouse: { name: { contains: warehouseName } } }];
      } else if (productName) {
        where.OR = [
          {
            details: {
              some: { product: { name: { contains: productName } } },
            },
          },
        ];
      }

      const totalOrder = await prisma.order.count({
        where,
      });
      const totalPage = Math.ceil(totalOrder / size);
      res.send({ totalPage });
    } catch (error) {
      console.error(error);
      res.status(400).json({
        message: error,
      });
    }
  },
};
