const authRoute = require('./auth.cjs')
const addressRoute = require('./address.cjs')
const warehousesRoute = require('./warehouses.cjs')
const productRoute = require('./product.cjs')
const categoryRoute = require('./category.cjs')
const userRouter = require('./admin/userRouter')
const adminAuthRoute = require('./admin/authRouter')

module.exports = {
  authRoute,
  addressRoute,
  warehousesRoute,
  productRoute,
  categoryRoute,
  userRouter,
  adminAuthRoute,
}
