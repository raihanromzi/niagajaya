const prisma = require('../utils/client.cjs')
const response = require('../utils/responses')

const getWarehouses = async (req, res) => {
  try {
    if (!req.session.id) {
      return res
        .status(400)
        .send(response.responseError(401, 'UNAUTHORIZED', 'NEED TO LOGIN'))
    }

    const search = req.query.search
    const managerId = req.query.manager
    const page = parseInt(req.query.page) || 1
    const size = parseInt(req.query.size) || 5
    const skip = (page - 1) * size
    const take = size

    const where = {}
    if (search) {
      where.OR = [{ name: { contains: search } }]
    }

    if (managerId) {
      where.manager = { id: parseInt(managerId) }
    }

    const warehouses = await prisma.warehouse.findMany({
      where,
      skip,
      take,
      select: {
        id: true,
        name: true,
        city: true,
        province: true,
        manager: {
          select: {
            email: true,
            role: true,
            names: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    })

    const count = await prisma.warehouse.count({ where })

    const totalPages = Math.ceil(count / size)

    res
      .status(200)
      .send(
        response.responseSuccess(
          200,
          'SUCCESS',
          { current_page: page, total_page: totalPages, totalData: count },
          warehouses
        )
      )
  } catch (error) {
    console.log(error)
    return res
      .status(500)
      .send(response.responseError(500, 'SERVER_ERROR', { message: error }))
  }
}

const getStockByWarehouse = async (req, res) => {
  try {
    if (!req.session.id) {
      return res
        .status(400)
        .send(response.responseError(401, 'UNAUTHORIZED', 'NEED TO LOGIN'))
    }
    const warehouseId = parseInt(req.params.id)
    const search = req.query.search
    const page = parseInt(req.query.page) || 1
    const size = parseInt(req.query.size) || 10
    const skip = (page - 1) * size
    const take = size

    const where = {}
    if (search) {
      where.OR = [{ name: { contains: search } }]
    }

    const stocks = await prisma.stock.findMany({
      where: {
        warehouseId,
      },
      skip,
      take,
      select: {
        warehouseId: true,
        productId: true,
        quantity: true,
        warehouse: {
          select: {
            name: true,
            city: true,
            province: true,
          },
        },
        product: {
          select: {
            id: true,
            category: {
              select: {
                name: true,
              },
            },
            name: true,
            imageUrl: true,
            priceRupiahPerUnit: true,
          },
        },
      },
    })

    const count = await prisma.stock.count({ where })
    const totalPages = Math.ceil(count / size)

    res
      .status(200)
      .send(
        response.responseSuccess(
          200,
          'SUCCESS',
          { current_page: page, total_page: totalPages, totalData: count },
          stocks
        )
      )
  } catch (error) {
    console.log(error)
    return res
      .status(500)
      .send(response.responseError(500, 'SERVER_ERROR', { message: error }))
  }
}

module.exports = { getWarehouses, getStockByWarehouse }
