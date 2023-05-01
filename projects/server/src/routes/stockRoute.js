const express = require('express')
const router = express.Router()

const {
  getWarehouses,
  getStockByWarehouse,
  updateStockProduct,
  deleteStockProduct,
  showAllStockHistory,
  showStockSummary,
} = require('../controllers/stockController')

// GET api/admin/stock/warehouses?search=SEARCH_TERM&manager=MANAGER_ID&page=PAGE_NUMBER&size=PAGE_SIZE
router.get('/admin/stock/warehouses', getWarehouses)

// GET /api/admin/stock/warehouses/1?manager=MANAGER_ID
router.get('/admin/stock/warehouses/:id', getStockByWarehouse)

// PUT /api/admin/stock/warehouses/1/products/1
router.put(
  '/admin/stock/warehouses/:warehouseId/products/:productId',
  updateStockProduct
)

// DELETE /api/admin/stock/warehouses/1/products/1
router.delete(
  '/admin/stock/warehouses/:warehouseId/products/:productId',
  deleteStockProduct
)
//  GET /api/admin/stock/warehouses/1/histories/1?manager=MANAGER_ID&product=PRODUCT_ID&dateTo=DATE_TO&dateFrom=DATE_FROM
router.get(
  '/admin/stock/warehouses/:warehouseId/histories/:productId',
  showAllStockHistory
)

//  GET /api/admin/stock/warehouses/1/histories?manager=MANAGER_ID
router.get('/admin/stock/warehouses/:warehouseId/histories', showStockSummary)

module.exports = router
