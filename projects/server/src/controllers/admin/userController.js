const prisma = require("../../utils/client.cjs");
const response = require("../../utils/responses");

const getAllAdmins = async (req, res) => {
  try {
    const admins = await prisma.user.findMany({
      where: {
        role: "ADMIN",
      },
    });
    res.status(200).send(response.responseSuccess("200", "SUCCESS", admins));
  } catch (e) {
    res.status(500).send(response.responseError("500", "SERVER_ERROR", { message: e }));
  }
};

const getAllWarehouseAdmins = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      where: {
        role: "MANAGER",
      },
    });
    res.status(200).send(response.responseSuccess("200", "SUCCESS", users));
  } catch (error) {
    res.status(500).send(response.responseError("500", "SERVER_ERROR", { message: error }));
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      where: {
        role: "USER",
      },
    });
    res.status(200).send(response.responseSuccess("200", "SUCCESS", users));
  } catch (error) {
    res.status(500).send(response.responseError("500", "SERVER_ERROR", { message: error }));
  }
};

const createAdmin = async (req, res) => {
  try {
    const { email, hashedPassword } = req.body;
    const newAdmin = await prisma.user.create({
      data: { email, hashedPassword, role: "ADMIN" },
    });
    res.status(201).send(response.responseSuccess("201", "CREATED", newAdmin));
  } catch (error) {
    console.log(error);
    res.status(500).send(response.responseError("500", "SERVER_ERROR", { message: error }));
  }
};

const updateAdmin = async (req, res) => {
  try {
    const { adminID } = req.param;
    const { email, hashedPassword } = req.body;

    const findAdmin = await prisma.user.findFirst({ where: { id: adminID, email } });

    if (!findAdmin) {
      res.status(404).send(response.responseError("404", "NOT FOUND", "ADMIN NOT FOUND"));
      return;
    }

    const updatedAdmin = await prisma.user.update({
      where: { id: adminID, email },
      data: { hashedPassword },
    });
    res.status(204).send(response.responseSuccess("204", "UPDATED", updatedAdmin));
  } catch (error) {
    res.status(500).send(response.responseError("500", "SERVER_ERROR", { message: error }));
  }
};

module.exports = { getAllAdmins, getAllWarehouseAdmins, getAllUsers, createAdmin, updateAdmin };
