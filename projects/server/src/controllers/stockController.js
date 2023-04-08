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
    const managerId = req.query.manager

    const search = req.query.search
    const page = parseInt(req.query.page) || 1
    const size = parseInt(req.query.size) || 10
    const skip = (page - 1) * size
    const take = size

    const checkIsAdmin = await prisma.user.findFirst({
      where: {
        id: parseInt(managerId),
        role: 'ADMIN',
      },
    })

    const checkWarehouseAdmin = await prisma.warehouse.findFirst({
      where: {
        id: warehouseId,
        managerId: parseInt(managerId),
      },
    })

    if (!checkWarehouseAdmin && !checkIsAdmin) {
      return res
        .status(400)
        .send(response.responseError(400, 'BAD_REQUEST', 'NOT AUTHORIZED'))
    }

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
    // console.log(error)
    return res
      .status(500)
      .send(response.responseError(500, 'SERVER_ERROR', { message: error }))
  }
}

const updateStockProduct = async (req, res) => {
  try {
    if (!req.session.id) {
      res
        .status(400)
        .send(response.responseError(401, 'UNAUTHORIZED', 'NEED TO LOGIN'))
      return
    }

    const { warehouseId, productId } = req.params
    const { quantity } = req.body

    const findProduct = await prisma.stock.findFirst({
      where: {
        warehouseId: parseInt(warehouseId),
        productId: parseInt(productId),
      },
      select: {
        warehouse: {
          select: {
            name: true,
          },
        },
        product: {
          select: {
            name: true,
          },
        },
        quantity: true,
      },
    })

    if (!findProduct) {
      return res
        .status(400)
        .send(
          response.responseError(
            400,
            'BAD_REQUEST',
            'Product / Warehouse not found!'
          )
        )
    }

    await prisma.stock.update({
      where: {
        productId_warehouseId: {
          productId: parseInt(productId),
          warehouseId: parseInt(warehouseId),
        },
      },
      data: {
        quantity: parseInt(quantity) >= 0 ? parseInt(quantity) : 0,
      },
    })

    const findUpdatedProduct = await prisma.stock.findFirst({
      where: {
        warehouseId: parseInt(warehouseId),
        productId: parseInt(productId),
      },
      select: {
        warehouse: {
          select: {
            name: true,
          },
        },
        product: {
          select: {
            name: true,
          },
        },
        quantity: true,
      },
    })

    if (!findUpdatedProduct) {
      return res
        .status(400)
        .send(
          response.responseError(
            400,
            'BAD_REQUEST',
            'Product / Warehouse not found!'
          )
        )
    }

    const stockBefore = findProduct.quantity
    const stockAfter = findUpdatedProduct.quantity

    // Untuk ngecek nambah beneran apa ngga
    const addOrAdd = (stockBefore, stockAfter) => {
      const count = Math.max(stockBefore, stockAfter)
      if (count === stockBefore) {
        return false
      } else {
        return true
      }
    }

    const newJournal = await prisma.type_Journal.create({
      data: {
        name: 'Update Stock',
        type: addOrAdd(stockBefore, stockAfter),
      },
    })

    const newJournalDetail = await prisma.journal.create({
      data: {
        typeId: newJournal.id,
        productId: parseInt(productId),
        stock_before: stockBefore,
        stock_after: stockAfter,
      },
    })

    if (!newJournal || !newJournalDetail) {
      return res
        .status(400)
        .send(
          response.responseError(
            400,
            'BAD_REQUEST',
            'Error when create journal'
          )
        )
    }

    const result = {
      product: findProduct.product.name,
      warehouse: findProduct.warehouse.name,
      type: newJournal.name,
      stock_before: findProduct.quantity,
      stock_after: findUpdatedProduct.quantity,
    }

    return res
      .status(200)
      .send(response.responseSuccess(200, 'SUCCESS UPDATE STOCK', {}, result))
  } catch (error) {
    return res
      .status(500)
      .send(response.responseError(500, 'SERVER_ERROR', { message: error }))
  }
}

const deleteStockProduct = async (req, res) => {
  try {
    if (!req.session.id) {
      res
        .status(400)
        .send(response.responseError(401, 'UNAUTHORIZED', 'NEED TO LOGIN'))
      return
    }

    const { warehouseId, productId } = req.params

    const findProduct = await prisma.stock.findFirst({
      where: {
        warehouseId: parseInt(warehouseId),
        productId: parseInt(productId),
      },
      select: {
        warehouse: {
          select: {
            name: true,
          },
        },
        product: {
          select: {
            name: true,
          },
        },
        quantity: true,
      },
    })

    if (!findProduct) {
      return res
        .status(400)
        .send(
          response.responseError(
            400,
            'BAD_REQUEST',
            'Product / Warehouse not found!'
          )
        )
    }

    await prisma.stock.update({
      where: {
        productId_warehouseId: {
          productId: parseInt(productId),
          warehouseId: parseInt(warehouseId),
        },
      },
      data: {
        quantity: 0,
      },
    })

    const findUpdatedProduct = await prisma.stock.findFirst({
      where: {
        warehouseId: parseInt(warehouseId),
        productId: parseInt(productId),
      },
      select: {
        warehouse: {
          select: {
            name: true,
          },
        },
        product: {
          select: {
            name: true,
          },
        },
        quantity: true,
      },
    })

    if (!findUpdatedProduct) {
      return res
        .status(400)
        .send(
          response.responseError(
            400,
            'BAD_REQUEST',
            'Product / Warehouse not found!'
          )
        )
    }

    const stockBefore = findProduct.quantity
    const stockAfter = findUpdatedProduct.quantity

    // Untuk ngecek nambah beneran apa ngga
    const addOrAdd = (stockBefore, stockAfter) => {
      const count = Math.max(stockBefore, stockAfter)
      if (count === stockBefore) {
        return false
      } else {
        return true
      }
    }

    const newJournal = await prisma.type_Journal.create({
      data: {
        name: 'Delete Stock',
        type: addOrAdd(stockBefore, stockAfter),
      },
    })

    const newJournalDetail = await prisma.journal.create({
      data: {
        typeId: newJournal.id,
        productId: parseInt(productId),
        stock_before: stockBefore,
        stock_after: stockAfter,
      },
    })

    if (!newJournal || !newJournalDetail) {
      return res
        .status(400)
        .send(
          response.responseError(
            400,
            'BAD_REQUEST',
            'Error when create journal'
          )
        )
    }

    const result = {
      product: findProduct.product.name,
      warehouse: findProduct.warehouse.name,
      type: newJournal.name,
      stock_before: findProduct.quantity,
      stock_after: findUpdatedProduct.quantity,
    }

    return res
      .status(200)
      .send(response.responseSuccess(200, 'SUCCESS DELETE STOCK', {}, result))
  } catch (error) {
    console.error(error)
    return res
      .status(500)
      .send(response.responseError(500, 'SERVER_ERROR', { message: error }))
  }
}

module.exports = {
  getWarehouses,
  getStockByWarehouse,
  updateStockProduct,
  deleteStockProduct,
}
