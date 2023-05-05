const express = require('express')
const router = express.Router()

const {
  getAllStockMutation,
  updateStockMutation,
} = require('../controllers/stockMutationController')

// Get all on progress stock mutation
router.get(
  '/admin/warehouses/:warehouseId/stock-mutations',
  getAllStockMutation
)

router.put(
  '/admin/warehouses/:warehouseId/stock-mutations/:stockMutationId',
  updateStockMutation
)

module.exports = router
