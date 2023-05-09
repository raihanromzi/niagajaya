const express = require('express')
const router = express.Router()

const {
  getAllStockMutation,
  approveStockMutation,
  cancelStockMutation,
  postNewStockMutation,
  getAllImporterWarehouse,
  getAllImporterWarehouseStock,
  getWarehouseById,
} = require('../controllers/stockMutationController')

// Get all on progress stock mutation
router.get(
  '/admin/warehouses/:warehouseId/stock-mutations',
  getAllStockMutation
)

router.put(
  '/admin/warehouses/:warehouseId/stock-mutations/:stockMutationId/approve',
  approveStockMutation
)

router.get('/admin/warehouses/:warehouseId', getWarehouseById)

router.put(
  '/admin/warehouses/:warehouseId/stock-mutations/:stockMutationId/cancel',
  cancelStockMutation
)

router.post('/admin/warehouses/stock-mutations/create', postNewStockMutation)

router.get('/admin/importerwarehouses/:warehouseId', getAllImporterWarehouse)

router.get(
  '/admin/exporterwarehouse/:warehouseId/stock',
  getAllImporterWarehouseStock
)

module.exports = router
