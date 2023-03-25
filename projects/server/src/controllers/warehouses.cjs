const { Prisma } = require("@prisma/client");
const prisma = require("../utils/client.cjs");

/** @type {Object<string, import("express").RequestHandler>} */
module.exports = {
  createWarehouse: async (req, res) => {
    try {
      const {
        name,
        managerId,
        province,
        city,
        detail,
        longitude,
        latitude,
        district,
      } = req.body;
      const result = await prisma.warehouse.create({
        data: {
          name,
          managerId,
          province,
          city,
          detail,
          longitude,
          latitude,
          district,
        },
      });
      res.send(result);
    } catch (error) {
      console.error(error);
      res.status(400).json({
        message: error,
      });
    }
  },
  getNonAffiliatedManagers: async (req, res) => {
    try {
      //softdelete
      // const result = await prisma.user.findMany({
      //   where: { role: "MANAGER", warehouse: { deletedAt: null } },
      // });
      const result = await prisma.user.findMany({
        where: { role: "MANAGER", warehouse: null },
      });
      res.send(result);
    } catch (error) {
      console.error(error);
      res.status(400).json({
        message: error,
      });
    }
  },
  getManager: async (req, res) => {
    try {
      const nonAffiliated = await prisma.user.findMany({
        where: { role: "MANAGER", warehouse: null },
      });
      const currentAffiliation = await prisma.user.findFirst({
        where: { id: parseInt(req.params.id) },
      });

      res.send([...nonAffiliated, currentAffiliation]);
    } catch (error) {
      console.error(error);
      res.status(400).json({
        message: error,
      });
    }
  },
  getWarehouses: async (req, res) => {
    try {
      const { page = 1, size = 10 } = req.query;
      const skip = (page - 1) * size;

      const result = await prisma.warehouse.findMany({
        //softdelete
        // where: {
        //   deletedAt: null,
        // },
        include: {
          manager: {
            select: { email: true },
          },
        },
        skip: parseInt(skip),
        take: parseInt(size),
      });
      res.send(result);
    } catch (error) {
      console.error(error);
      res.status(400).json({
        message: error,
      });
    }
  },
  getTotalPage: async (req, res) => {
    try {
      const { size = 10 } = req.query;
      const totalProduct = await prisma.warehouse.count();
      const totalPage = Math.ceil(totalProduct / size);
      res.send({ totalPage });
    } catch (error) {
      console.error(error);
      res.status(400).json({
        message: error,
      });
    }
  },
  deleteWarehouse: async (req, res) => {
    try {
      //softdelete
      // const result = await prisma.warehouse.update({
      //   data: { deletedAt: new Date() },
      // });
      const result = await prisma.warehouse.delete({
        where: { id: parseInt(req.params.id) },
      });
      res.send(result);
    } catch (error) {
      console.error(error);
      res.status(400).json({
        message: error,
      });
    }
  },
  getWarehouse: async (req, res) => {
    try {
      const result = await prisma.warehouse.findFirst({
        where: { id: parseInt(req.params.id) },
      });
      res.send(result);
    } catch (error) {
      console.error(error);
      res.status(400).json({
        message: error,
      });
    }
  },
  updateWarehouse: async (req, res) => {
    try {
      const {
        name,
        managerId,
        province,
        city,
        detail,
        longitude,
        latitude,
        district,
      } = req.body;
      const result = await prisma.warehouse.update({
        where: {
          id: parseInt(req.params.id),
        },
        data: {
          name,
          managerId,
          province,
          city,
          detail,
          longitude,
          latitude,
          district,
        },
      });
      res.send(result);
    } catch (error) {
      console.error(error);
      res.status(400).json({
        message: error,
      });
    }
  },
};
