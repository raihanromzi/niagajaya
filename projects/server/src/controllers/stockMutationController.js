const prisma = require('../utils/client.cjs')
const response = require('../utils/responses')

const getAllStockMutation = async (req, res) => {
  try {
    const { warehouseId = parseInt(req.params.warehouseId) } = req.params
    const {
      manager: managerId,
      page = 1,
      limit = 5,
      search = '',
      start,
      end,
      sortBy,
      statusMutation,
    } = req.query
    const skip = (page - 1) * limit
    const result = []

    if (!req.session.id) {
      return res
        .status(400)
        .send(response.responseError(401, 'UNAUTHORIZED', 'NEED TO LOGIN'))
    }
    const checkIsAdmin = await prisma.user.findFirst({
      where: {
        id: parseInt(managerId),
        role: 'ADMIN',
      },
    })

    const checkWarehouseAdmin = await prisma.warehouse.findFirst({
      where: {
        id: parseInt(warehouseId),
        managerId: parseInt(managerId),
      },
    })

    if (!checkWarehouseAdmin && !checkIsAdmin) {
      return res
        .status(400)
        .send(response.responseError(400, 'BAD_REQUEST', 'NOT AUTHORIZED'))
    }

    let orderBy
    switch (sortBy) {
      case 'latest':
        orderBy = { id: 'desc' }
        break
      case 'oldest':
        orderBy = { id: 'asc' }
        break
      default:
        orderBy = { id: 'desc' }
        break
    }

    let status
    switch (statusMutation) {
      case 'requested':
        status = 'REQUESTED'
        break
      case 'accepted':
        status = 'ACCEPTED'
        break
      case 'cancelled':
        status = 'CANCELLED'
        break
      case 'auto':
        status = 'AUTO'
        break
      default:
        return res.status(404).send(response.responseError(404, 'NOT_FOUND'))
    }

    const getAllOnProgressStockMutation = await prisma.stockMutation.findMany({
      skip,
      take: parseInt(limit),
      orderBy,
      where: {
        importerId: parseInt(warehouseId),
        status,
        createdAt: {
          gt: start ? new Date(start).toISOString() : undefined,
          lt: end ? new Date(end).toISOString() : undefined,
        },
        product: {
          name: {
            contains: search,
          },
        },
      },
      select: {
        id: true,
        product: {
          select: {
            id: true,
            name: true,
          },
        },
        exporter: {
          select: {
            id: true,
            name: true,
          },
        },
        importer: {
          select: {
            id: true,
            name: true,
          },
        },
        status: true,
        quantity: true,
        createdAt: true,
      },
    })

    for (let i = 0; i < getAllOnProgressStockMutation.length; i++) {
      const { id, product, exporter, importer, status, quantity, createdAt } =
        getAllOnProgressStockMutation[i]
      result.push({
        stockMutataionId: id,
        productId: product.id,
        productName: product.name,
        originWarehouseId: exporter.id,
        originWarehouseName: exporter.name,
        destinationWarehouseId: importer.id,
        destinationWarehouseName: importer.name,
        status,
        quantity,
        createdAt,
      })
    }

    const getAllOnProgressStockMutationCount = await prisma.stockMutation.count(
      {
        where: {
          importerId: parseInt(warehouseId),
          status: 'REQUESTED',
          createdAt: {
            gt: start ? new Date(start).toISOString() : undefined,
            lt: end ? new Date(end).toISOString() : undefined,
          },
          product: {
            name: {
              contains: search,
            },
          },
        },
      }
    )

    const totalPages = Math.ceil(getAllOnProgressStockMutationCount / limit)

    res.send(
      response.responseSuccess(
        200,
        'SUCCESS',
        {
          current_page: parseInt(page),
          total_page: totalPages,
          totalData: getAllOnProgressStockMutationCount,
        },
        result
      )
    )
  } catch (error) {
    console.log(error)
    return res
      .status(500)
      .send(response.responseError(500, 'SERVER_ERROR', { message: error }))
  }
}

const updateStockMutation = async (req, res) => {
  try {
    const { warehouseId = parseInt(req.params.warehouseId), stockMutationId } =
      req.params
    const {
      manager: managerId,
      page = 1,
      limit = 5,
      search = '',
      start,
      end,
      sortBy,
    } = req.query
    const skip = (page - 1) * limit

    if (!req.session.id) {
      return res
        .status(400)
        .send(response.responseError(401, 'UNAUTHORIZED', 'NEED TO LOGIN'))
    }
    const checkIsAdmin = await prisma.user.findFirst({
      where: {
        id: parseInt(managerId),
        role: 'ADMIN',
      },
    })

    const checkWarehouseAdmin = await prisma.warehouse.findFirst({
      where: {
        id: parseInt(warehouseId),
        managerId: parseInt(managerId),
      },
    })

    if (!checkWarehouseAdmin && !checkIsAdmin) {
      return res
        .status(400)
        .send(response.responseError(400, 'BAD_REQUEST', 'NOT AUTHORIZED'))
    }

    let orderBy
    switch (sortBy) {
      case 'latest':
        orderBy = { orderId: 'desc' }
        break
      case 'oldest':
        orderBy = { orderId: 'asc' }
        break
      default:
        orderBy = { orderId: 'desc' }
        break
    }
    const findStockMutation = await prisma.stockMutation.findUnique({
      where: {
        id: parseInt(stockMutationId),
      },
    })

    if (!findStockMutation) {
      return res
        .status(400)
        .send(response.responseError(400, 'BAD_REQUEST', 'NOT FOUND'))
    }

    if (findStockMutation.status !== 'REQUESTED') {
      return res
        .status(400)
        .send(
          response.responseError(
            400,
            'BAD_REQUEST',
            'STOCK MUTATION ALREADY APPROVED / REJECTED'
          )
        )
    }

    // Cek apakah di warehouse exporternya ada stocknya
    const checkStock = await prisma.stock.findFirst({
      where: {
        warehouseId: findStockMutation.exporterId,
        productId: findStockMutation.productId,
        quantity: {
          gte: findStockMutation.quantity,
        },
      },
    })

    if (!checkStock) {
      return res
        .status(400)
        .send(
          response.responseError(
            400,
            'BAD_REQUEST',
            'STOCK NOT ENOUGH TO APPROVE STOCK MUTATION'
          )
        )
    }

    // update stock exporter
    await prisma.stock.update({
      where: {
        productId_warehouseId: {
          productId: parseInt(findStockMutation.productId),
          warehouseId: parseInt(findStockMutation.exporterId),
        },
      },
      data: {
        quantity: findStockMutation.quantity,
      },
    })

    const findUpdatedProductExporter = await prisma.stock.findFirst({
      where: {
        productId: parseInt(findStockMutation.productId),
        warehouseId: parseInt(findStockMutation.exporterId),
      },
      select: {
        id: true,
        quantity: true,
      },
    })

    if (!findUpdatedProductExporter) {
      return res
        .status(400)
        .send(response.responseError(400, 'BAD_REQUEST', 'NOT FOUND'))
    }

    const stockBeforeExporter = checkStock.quantity
    const stockAfterExporter = findUpdatedProductExporter.quantity

    // Untuk ngecek nambah atau ngurang
    const addOrAdd = (stockBefore, stockAfter) => {
      const count = Math.max(stockBefore, stockAfter)
      if (count === stockBeforeExporter) {
        return false
      } else {
        return true
      }
    }

    const newJournalExporter = await prisma.type_Journal.create({
      data: {
        name: 'Update Stock',
        type: addOrAdd(stockBeforeExporter, stockAfterExporter),
      },
    })

    const newJournalDetailExporter = await prisma.journal.create({
      data: {
        typeId: newJournalExporter.id,
        productId: parseInt(findStockMutation.productId),
        warehouseId: parseInt(findStockMutation.exporterId),
        stock_before: stockBeforeExporter,
        stock_after: stockAfterExporter,
      },
    })

    if (!newJournalExporter || !newJournalDetailExporter) {
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

    // update stock importer
    await prisma.stock.update({
      where: {
        productId_warehouseId: {
          productId: parseInt(findStockMutation.productId),
          warehouseId: parseInt(findStockMutation.exporterId),
        },
      },
      data: {
        quantity: findStockMutation.quantity,
      },
    })

    const findUpdatedProductImporter = await prisma.stock.findFirst({
      where: {
        productId: parseInt(findStockMutation.productId),
        warehouseId: parseInt(findStockMutation.exporterId),
      },
      select: {
        id: true,
        quantity: true,
      },
    })

    if (!findUpdatedProductImporter) {
      return res
        .status(400)
        .send(response.responseError(400, 'BAD_REQUEST', 'NOT FOUND'))
    }

    const stockBeforeImporter = checkStock.quantity
    const stockAfterImporter = findUpdatedProductExporter.quantity

    const newJournalImporter = await prisma.type_Journal.create({
      data: {
        name: 'Update Stock',
        type: addOrAdd(stockBeforeImporter, stockAfterImporter),
      },
    })

    const newJournalDetailImporter = await prisma.journal.create({
      data: {
        typeId: newJournalExporter.id,
        productId: parseInt(findStockMutation.productId),
        warehouseId: parseInt(findStockMutation.exporterId),
        stock_before: stockBeforeImporter,
        stock_after: stockAfterImporter,
      },
    })

    if (!newJournalImporter || !newJournalDetailImporter) {
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
      stockMutationId: findStockMutation.id,
      productId: findStockMutation.productId,
      stockAfterExporter,
      stockAfterImporter,
    }

    res.status(200).send(response.responseSuccess(200, 'SUCCESS', {}, result))
  } catch (error) {
    console.log(error)
    return res
      .status(500)
      .send(response.responseError(500, 'SERVER_ERROR', { message: error }))
  }
}

module.exports = {
  getAllStockMutation,
  updateStockMutation,
}
