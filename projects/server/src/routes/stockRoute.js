const express = require('express')
const router = express.Router()

const {
  getWarehouses,
  getStockByWarehouse,
} = require('../controllers/stockController')

// GET api/admin/stock/warehouses?search=SEARCH_TERM&manager=MANAGER_ID&page=PAGE_NUMBER&size=PAGE_SIZE
router.get('/admin/stock/warehouses', getWarehouses)

router.get('/admin/stock/warehouses/:id', getStockByWarehouse)

module.exports = router
