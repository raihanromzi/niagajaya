const authRoute = require('./auth.cjs')
const addressRoute = require('./address.cjs')
const warehousesRoute = require('./warehouses.cjs')
const productRoute = require('./product.cjs')
const categoryRoute = require('./category.cjs')
const orderRoute = require('./order.cjs')
const userRouter = require('./admin/userRouter')
const adminAuthRoute = require('./admin/authRouter')
const stockRoute = require('./stockRoute')
const salesReportRoute = require('./salesReportRoute')
const stockMutationRoute = require('./stockMutationRoute')

module.exports = {
  authRoute,
  addressRoute,
  warehousesRoute,
  productRoute,
  categoryRoute,
  orderRoute,
  userRouter,
  adminAuthRoute,
  stockRoute,
  salesReportRoute,
  stockMutationRoute,
}
