const prisma = require('../utils/client.cjs')
const response = require('../utils/responses')

const getAllSalesReportByWarehouse = async (req, res) => {
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
      category,
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
        orderBy = { orderId: 'desc' }
        break
      case 'oldest':
        orderBy = { orderId: 'asc' }
        break
      default:
        orderBy = { orderId: 'desc' }
        break
    }

    const getAllOrder = await prisma.orderDetail.findMany({
      skip,
      take: parseInt(limit),
      orderBy,
      where: {
        product: {
          orders: {
            some: {
              order: {
                warehouseId: parseInt(warehouseId),
                status: 'DELIVERED',
                createdAt: {
                  gt: start ? new Date(start).toISOString() : undefined,
                  lt: end ? new Date(end).toISOString() : undefined,
                },
              },
            },
          },
          OR: [
            {
              name: { contains: search },
              category: {
                name: category ? { contains: category } : undefined,
              },
            },
          ],
        },
      },
      select: {
        order: {
          select: {
            id: true,
            user: {
              select: {
                id: true,
                names: {
                  select: {
                    name: true,
                  },
                },
              },
            },
            status: true,
            userAddressFull: true,
            shipmentMethod: true,
            createdAt: true,
          },
        },
        product: {
          select: {
            name: true,
            imageUrl: true,
            category: {
              select: {
                name: true,
              },
            },
          },
        },
        quantity: true,
        priceRupiahPerUnit: true,
      },
    })

    for (let i = 0; i < getAllOrder.length; i++) {
      const { order, product, quantity, priceRupiahPerUnit } = getAllOrder[i]
      result.push({
        orderId: order.id,
        userId: order.user.id,
        userName: order.user.names[0].name,
        userAddressFull: order.userAddressFull,
        shipmentMethod: order.shipmentMethod,
        status: order.status,
        orderedAt: order.createdAt,
        productName: product.name,
        productImageUrl: product.imageUrl,
        productCategory: product.category.name,
        quantity,
        pricePerUnit: priceRupiahPerUnit,
        totalPrice: quantity * priceRupiahPerUnit,
      })
    }

    const totalData = await prisma.orderDetail.count({
      where: {
        order: {
          warehouseId: parseInt(warehouseId),
          status: 'DELIVERED',
          createdAt: {
            gt: start ? new Date(start).toISOString() : undefined,
            lt: end ? new Date(end).toISOString() : undefined,
          },
        },
      },
    })

    const totalPage = Math.ceil(totalData / limit)

    return res.status(200).send(
      response.responseSuccess(
        200,
        'SUCCESS',
        {
          current_page: parseInt(page),
          total_page: totalPage,
          total_data: result.length,
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

module.exports = {
  getAllSalesReportByWarehouse,
}
