const express = require('express')
const router = express.Router()

const {
  getAllSalesReportByWarehouse,
} = require('../controllers/salesReportController')

router.get(
  '/admin/sales-report/warehouses/:warehouseId',
  getAllSalesReportByWarehouse
)

module.exports = router
