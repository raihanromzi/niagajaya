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
        stockMutationId: id,
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
    return res
      .status(500)
      .send(response.responseError(500, 'SERVER_ERROR', { message: error }))
  }
}

const approveStockMutation = async (req, res) => {
  try {
    const { warehouseId = parseInt(req.params.warehouseId), stockMutationId } =
      req.params
    const { manager: managerId } = req.query

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

    // STEP 1 CARI STOCK MUTATION & HARUS REQUESTED
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

    // STEP 2 CARI STOCK EXPORTER (GUDANG ASAL)
    // Cek apakah di warehouse exporternya (gudang asal) ada stocknya
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

    // STEP 3 KALAU ADA, UPDATE STOCK EXPORTER (GUDANG ASAL)
    // KURANGI STOCK EXPORTER (GUDANG ASAL) DENGAN QUANTITY YANG DI MUTASI
    // update stock exporter
    await prisma.stock.update({
      where: {
        productId_warehouseId: {
          productId: parseInt(findStockMutation.productId),
          warehouseId: parseInt(findStockMutation.exporterId),
        },
      },
      data: {
        quantity: checkStock.quantity - findStockMutation.quantity,
      },
    })

    // STEP 4 CARI STOCK YANG TELAH DI UPDATE DI EXPORTER (GUDANG ASAL)
    const findUpdatedProductExporter = await prisma.stock.findFirst({
      where: {
        productId: parseInt(findStockMutation.productId),
        warehouseId: parseInt(findStockMutation.exporterId),
      },
      select: {
        productId: true,
        quantity: true,
      },
    })

    if (!findUpdatedProductExporter) {
      return res
        .status(400)
        .send(response.responseError(400, 'BAD_REQUEST', 'NOT FOUND'))
    }

    // STEP 5 CREATE JOURNAL APAKAH BENAR TERJADI PENGURANGAN?
    const stockBeforeExporter = checkStock.quantity
    const stockAfterExporter = findUpdatedProductExporter.quantity

    const addOrAdd = (stockBefore, stockAfter) => {
      const count = Math.max(stockBefore, stockAfter)
      if (count === stockBefore) {
        return false
      } else {
        return true
      }
    }

    // STEP 6 CREATE JOURNAL
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

    // STEP 7 UPDATE STOCK IMPORTER (GUDANG TUJUAN)
    const findStockImporter = await prisma.stock.findFirst({
      where: {
        warehouseId: findStockMutation.importerId,
        productId: findStockMutation.productId,
      },
      select: {
        productId: true,
        quantity: true,
      },
    })

    await prisma.stock.update({
      where: {
        productId_warehouseId: {
          productId: parseInt(findStockMutation.productId),
          warehouseId: parseInt(findStockMutation.importerId),
        },
      },
      data: {
        quantity: findStockImporter.quantity + findStockMutation.quantity,
      },
    })

    // STEP 8 CARI STOCK DI IMPORTER (GUDANG TUJUAN)
    const findProductImporter = await prisma.stock.findFirst({
      where: {
        productId: parseInt(findStockMutation.productId),
        warehouseId: parseInt(findStockMutation.importerId),
      },
      select: {
        productId: true,
        quantity: true,
      },
    })

    if (!findProductImporter) {
      return res
        .status(400)
        .send(response.responseError(400, 'BAD_REQUEST', 'NOT FOUND'))
    }

    await prisma.stockMutation.update({
      where: {
        id: parseInt(stockMutationId),
      },
      data: {
        status: 'ACCEPTED',
      },
    })

    // STEP 9 CARI STOCK YANG TELAH DI UPDATE DI IMPORTER (GUDANG TUJUAN)
    const findUpdatedProductImported = await prisma.stock.findFirst({
      where: {
        productId: parseInt(findStockMutation.productId),
        warehouseId: parseInt(findStockMutation.importerId),
      },
      select: {
        productId: true,
        quantity: true,
      },
    })

    if (!findUpdatedProductImported) {
      return res
        .status(400)
        .send(response.responseError(400, 'BAD_REQUEST', 'NOT FOUND'))
    }

    const stockBeforeImporter = findStockImporter.quantity
    const stockAfterImporter = findUpdatedProductImported.quantity

    // STEP 10 BUAT JURNAL JIKA TERJADI PERUBAHAN
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
        warehouseId: parseInt(findStockMutation.importerId),
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
    return res
      .status(500)
      .send(response.responseError(500, 'SERVER_ERROR', { message: error }))
  }
}

const cancelStockMutation = async (req, res) => {
  try {
    const { warehouseId = parseInt(req.params.warehouseId), stockMutationId } =
      req.params
    const { manager: managerId } = req.query

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

    // STEP 1 CARI STOCK MUTATION & HARUS REQUESTED
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

    const cancel = await prisma.stockMutation.update({
      where: {
        id: parseInt(stockMutationId),
      },
      data: {
        status: 'CANCELLED',
      },
    })
    if (!cancel) {
      return res
        .status(400)
        .send(response.responseError(400, 'BAD_REQUEST', 'NOT FOUND'))
    }

    res.status(200).send(response.responseSuccess(200, 'SUCCESS', {}, cancel))
  } catch (error) {
    return res
      .status(500)
      .send(response.responseError(500, 'SERVER_ERROR', { message: error }))
  }
}

const postNewStockMutation = async (req, res) => {
  try {
    const { warehouseId = parseInt(req.params.warehouseId) } = req.params
    const { manager: managerId } = req.query
    const { exportedId, importerId, productId, quantity } = req.body

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
  } catch (error) {
    return res
      .status(500)
      .send(response.responseError(500, 'SERVER_ERROR', { message: error }))
  }
}

const getAllImporterWarehouse = async (req, res) => {
  try {
    const { warehouseId: exporterWarehouseId } = req.params

    const warehouses = await prisma.warehouse.findMany({
      where: {
        NOT: {
          id: parseInt(exporterWarehouseId),
        },
      },
    })

    if (!warehouses) {
      return res
        .status(400)
        .send(response.responseError(400, 'BAD_REQUEST', 'NOT FOUND'))
    }

    return res
      .status(200)
      .send(response.responseSuccess(200, 'SUCCESS', {}, warehouses))
  } catch (error) {
    return res
      .status(500)
      .send(response.responseError(500, 'SERVER_ERROR', { message: error }))
  }
}

const getAllImporterWarehouseStock = async (req, res) => {
  try {
  } catch (error) {
    return res
      .status(500)
      .send(response.responseError(500, 'SERVER_ERROR', { message: error }))
  }
}

module.exports = {
  getAllStockMutation,
  approveStockMutation,
  cancelStockMutation,
  postNewStockMutation,
  getAllImporterWarehouse,
}
