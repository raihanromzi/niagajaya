const authRoute = require("./auth.cjs");
const addressRoute = require("./address.cjs");
const adminAuthRoute = require("./admin/authRouter");
const userRoute = require("./admin/userRouter");

module.exports = {
  authRoute,
  addressRoute,
  adminAuthRoute,
  userRoute,
};
