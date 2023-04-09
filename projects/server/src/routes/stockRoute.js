const express = require('express')
const router = express.Router()

const {
  getWarehouses,
  getStockByWarehouse,
  updateStockProduct,
  deleteStockProduct,
  showAllStockHistory,
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
//  GET /api/admin/stock/warehouses/1/history?manager=MANAGER_ID
router.get('/admin/stock/warehouses/:warehouseId/history/:productId', showAllStockHistory)

module.exports = router
