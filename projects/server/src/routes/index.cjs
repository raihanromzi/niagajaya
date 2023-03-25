const authRoute = require("./auth.cjs");
const addressRoute = require("./address.cjs");
const adminAuthRoute = require("./admin/authRouter");
const userRoute = require("./admin/userRouter");
const warehousesRoute = require("./warehouses.cjs");
const productRoute = require("./product.cjs");
const categoryRoute = require("./category.cjs");


module.exports = {
  authRoute,
  addressRoute,
  adminAuthRoute,
  userRoute,
  warehousesRoute,
  productRoute,
  categoryRoute,
};
