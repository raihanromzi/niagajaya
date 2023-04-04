const prisma = require("../../../utils/client.cjs");
const response = require("../../../utils/responses");
const { randomUUID } = require("crypto");
const bcrypt = require("bcrypt");

const getAllUsers = async (req, res) => {
  try {
    const { role } = req.query;
    let { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    if (!req.session.id) {
      return res.status(400).send(response.responseError(401, "UNAUTHORIZED", "NEED TO LOGIN"));
    }

    if (!role) {
      return res.status(400).send(response.responseError(400, "BAD_REQUEST", "ADD ROLE QUERY"));
    }

    const users = await prisma.user.findMany({
      take: parseInt(limit),
      skip,
      where: {
        role: role.toUpperCase(),
      },
      select: {
        id: true,
        email: true,
        role: true,
        imageUrl: true,
        token: true,
        names: {
          select: {
            name: true,
          },
        },
        warehouse: {
          select: { name: true },
        },
      },
    });

    const resultCount = await prisma.user.count({
      where: {
        role: role.toUpperCase(),
      },
    });
    const totalPage = Math.ceil(resultCount / limit);

    return res.status(200).send(response.responseSuccess(200, "SUCCESS", { current_page: page, total_page: totalPage, totalData: resultCount }, users));
  } catch (e) {
    // console.log(e);
    return res.status(500).send(response.responseError(500, "SERVER_ERROR", { message: e }));
  }
};

const createAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const token = randomUUID();
    const hashedPassword = await bcrypt.hash(password, 10);

    if (!req.session.id) {
      return res.status(400).send(response.responseError(401, "UNAUTHORIZED", "NEED TO LOGIN"));
    }

    const users = await prisma.user.findMany({
      where: {
        email,
      },
    });

    if (users.length > 0) {
      return res.status(400).send(response.responseError(400, "BAD_REQUEST", "EMAIL ALREADY REGISTERED"));
    }

    const newAdmin = await prisma.user.create({
      data: { email, hashedPassword, role: "ADMIN", token, names: { create: { name } } },
    });

    res.status(201).send(response.responseSuccess(201, "CREATED", { email: newAdmin.email, name: newAdmin.name, role: newAdmin.role, image: newAdmin.imageUrl }));
  } catch (error) {
    // console.log(error);
    res.status(500).send(response.responseError(500, "SERVER_ERROR", "PLEASE TRY AGAIN"));
    return;
  }
};

const updateAdmin = async (req, res) => {
  try {
    if (!req.session.id) {
      res.status(400).send(response.responseError(401, "UNAUTHORIZED", "NEED TO LOGIN"));
      return;
    }
    const { adminID } = req.params;
    const { name, email, newName } = req.body;

    if (!req.session.id) {
      res.status(400).send(response.responseError(401, "UNAUTHORIZED", "NEED TO LOGIN"));
      return;
    }

    const findAdminID = await prisma.user.findFirst({ where: { id: parseInt(adminID) } });

    if (!findAdminID) {
      res.status(404).send(response.responseError(404, "NOT FOUND", "ADMIN NOT FOUND"));
      return;
    }

    const findAdminEmail = await prisma.user.findFirst({ where: { email } });
    if (!findAdminEmail) {
      res.status(404).send(response.responseError(404, "NOT FOUND", "ADMIN NOT FOUND"));
      return;
    }

    const updatedAdmin = await prisma.user.update({
      where: { id: findAdminID.id },
      data: { email, names: { update: { where: { userId_name: { userId: findAdminID.id, name } }, data: { name: newName } } } },
    });

    res.status(200).send(response.responseSuccess(200, "SUCCESS", { email: updatedAdmin.email, role: updatedAdmin.role, image: updatedAdmin.imageUrl }));
    return;
  } catch (error) {
    // console.log(error);
    res.status(500).send(response.responseError(500, "SERVER_ERROR", "PLEASE TRY AGAIN"));
    return;
  }
};

const deleteAdmin = async (req, res) => {
  try {
    if (!req.session.id) {
      res.status(400).send(response.responseError(401, "UNAUTHORIZED", "NEED TO LOGIN"));
      return;
    }
    const { adminID } = req.params;

    const findAdmin = await prisma.user.findFirst({ where: { id: parseInt(adminID) } });

    if (!findAdmin) {
      res.status(404).send(response.responseError(404, "NOT FOUND", "ADMIN NOT FOUND"));
      return;
    }

    const deleteAdmin = await prisma.user.delete({ where: { id: parseInt(adminID) } });

    if (deleteAdmin) {
      res.status(200).send(response.responseSuccess(200, "SUCCESS", "ADMIN DELETED"));
      return;
    }
  } catch (error) {
    // console.log(error);
    res.status(500).send(response.responseError(500, "SERVER_ERROR", "PLEASE TRY AGAIN"));
    return;
  }
};

module.exports = { getAllUsers, createAdmin, updateAdmin, deleteAdmin };
