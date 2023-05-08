const express = require('express')
const router = express.Router()

const {
  getAllStockMutation,
  approveStockMutation,
  cancelStockMutation,
  postNewStockMutation,
  getAllImporterWarehouse,
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

router.put(
  '/admin/warehouses/:warehouseId/stock-mutations/:stockMutationId/cancel',
  cancelStockMutation
)

router.put(
  '/admin/warehouses/:warehouseId/stock-mutations/create',
  postNewStockMutation
)

router.get(
  '/admin/importerwarehouses/:warehouseId',
  getAllImporterWarehouse
)

module.exports = router
