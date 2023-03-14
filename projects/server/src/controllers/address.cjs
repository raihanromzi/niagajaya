const axios = require("axios");
const prisma = require("../utils/client.cjs");

/** @type {Object<string, import("express").RequestHandler>} */
module.exports = {
  getProvinces: async (_req, res) => {
    try {
      const response = await axios.get(
        "https://api.rajaongkir.com/starter/province",
        { headers: { key: process.env.API_KEY_RAJAONGKIR } }
      );
      res.send({ results: response.data.rajaongkir.results });
    } catch (error) {
      console.error(error);
      res.status(400).json({
        message: error,
      });
    }
  },
  getCitys: async (req, res) => {
    try {
      const response = await axios.get(
        "https://api.rajaongkir.com/starter/city?province=" +
          req.query.province,
        {
          headers: { key: process.env.API_KEY_RAJAONGKIR },
        }
      );
      res.send({ results: response.data.rajaongkir.results });
    } catch (error) {
      console.error(error);
      res.status(400).json({
        message: error,
      });
    }
  },
  createAddress: async (req, res) => {
    try {
      const {
        latitude,
        longitude,
        province,
        city,
        detail,
        street,
        postalCode,
        main,
      } = req.body;
      // const result = await prisma.userAddress.create({
      //   data: {
      //     userId: req.session.user.id,
      //     latitude: latitude,
      //     longitude: longitude,
      //     province: province,
      //     city: city,
      //     street: street,
      //     postalCode: postalCode,
      //     detail: detail,
      //   },
      // });
      const user = await prisma.user.update({
        where: { id: req.session.user.id },
        data: {
          addresses: {
            create: {
              latitude,
              longitude,
              province,
              city,
              detail,
              street,
              postalCode,
              primaryAddress: main && {
                connectOrCreate: {
                  where: { userId: req.session.user.id },
                  create: { userId: req.session.user.id },
                },
              },
            },
          },
        },
        include: { addresses: true },
      });
      // if (main) {
      //   const primaryAddress = await prisma.userPrimaryAddress.findFirst({
      //     where: { userId: req.session.user.id },
      //   });
      //   if (primaryAddress) {
      //     await prisma.userPrimaryAddress.create({
      //       data: { userId: req.session.user.id, addressId: result.id },
      //     });
      //   } else {
      //     await prisma.userPrimaryAddress.update({
      //       where: { userId: req.session.user.id },
      //       data: { addressId: result.id },
      //     });
      //   }
      // }
      console.log(user);
      res.send({ message: "Berhasil" });
    } catch (error) {
      console.error(error);
      res.status(400).json({
        message: error,
      });
    }
  },
  getAddresses: async (req, res) => {
    try {
      const addresses = await prisma.userAddress.findMany({
        where: { userId: req.session.user.id },
      });
      const primaryAddress = await prisma.userPrimaryAddress.findFirst({
        where: { userId: req.session.user.id },
      });
      let newResult = [];
      if (primaryAddress) {
        addresses.map((address) => {
          if (address.id === primaryAddress.addressId) {
            newResult.unshift({ ...address, main: true });
          } else {
            newResult.push(address);
          }
        });
      } else {
        newResult = addresses;
      }
      res.send(newResult);
    } catch (error) {
      console.error(error);
      res.status(400).json({
        message: error,
      });
    }
  },
  updateAddress: async (req, res) => {
    try {
      const { latitude, longitude, province, city, detail, district } =
        req.body;

      const result = await prisma.userAddress.update({
        where: { id: req.params.id },
        data: {
          userId: req.session.user.id,
          latitude,
          longitude,
          province,
          city,
          district,
          detail,
        },
      });
      console.log(result);
      res.send(result);
    } catch (error) {
      console.error(error);
      res.status(400).json({
        message: error,
      });
    }
  },

  getAddress: async (req, res) => {
    try {
      const result = await prisma.userAddress.findFirst({
        where: { userId: req.session.user?.id, id: parseInt(req.params.id) },
        select: {
          id: true,
          latitude: true,
          longitude: true,
          province: true,
          city: true,
          detail: true,
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
  deleteAddress: async (req, res) => {
    try {
      const result = await prisma.userAddress.delete({
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
};
