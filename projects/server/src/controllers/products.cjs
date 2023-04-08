const { validationResult } = require('express-validator')
const fs = require('fs/promises')
const prisma = require('../utils/client.cjs')

/** @type {Object<string, import("express").RequestHandler>} */
module.exports = {
  getProducts: async (req, res) => {
    try {
      const { search = '', column, method, page = 0 } = { ...req.query }

      const filter = { where: { name: { contains: search } } }

      const products = await prisma.product.findMany({
        include: { category: { select: { name: true } } },
        ...filter,
        orderBy: {
          ...(column === 'name' && { name: method }),
          ...(column === 'category' && { categoryId: method }),
          ...(column === 'status' && { deletedAt: method }),
        },
        take: 10,
        skip: +page * 10,
      })

      const count = await prisma.product.count({ ...filter })

      res.json({
        success: true,
        products,
        pages: [...new Array(Math.ceil(count / 10)).keys()],
      })
    } catch (err) {
      res.status(400).json({ success: false, errors: { unknown: err } })
    }
  },
  createProduct: async (req, res) => {
    try {
      validationResult(req).throw()

      const { name, description, priceRupiahPerUnit, status, category } =
        req.body

      const newProduct = await prisma.product.create({
        data: {
          name,
          description,
          priceRupiahPerUnit: +priceRupiahPerUnit,
          imageUrl: req.file.filename,
          ...(status === 'archived' && { deletedAt: new Date() }),
          category: { connect: { id: +category } },
        },
      })

      // Inject to all warehouses with quantity 0
      const getTotalWarehouse = await prisma.warehouse.findMany({})
      for (let i = 0; i < getTotalWarehouse.length; i++) {
        const warehouseId = getTotalWarehouse[i].id
        await prisma.stock.create({
          data: {
            warehouseId,
            productId: newProduct.id,
            quantity: 0,
          },
        })
      }

      res.json({ success: true, msg: 'Produk baru berhasil dibuat!' })
    } catch (err) {
      const errors = 'errors' in err ? err.mapped() : { unknown: err }
      res.status(400).json({
        success: false,
        errors,
      })
    }
  },
  editProduct: async (req, res) => {
    try {
      validationResult(req).throw()

      const { name, description, priceRupiahPerUnit, status, category } = {
        ...req.body,
      }

      if (req.file) {
        const product = await prisma.product.findUnique({
          where: { id: +req.params.id },
          select: { imageUrl: true },
        })
        await fs.unlink(`./public/products/${product.imageUrl}`)
      }

      await prisma.product.update({
        where: { id: +req.params.id },
        data: {
          ...(name && { name }),
          ...(description && { description }),
          ...(priceRupiahPerUnit && { priceRupiahPerUnit }),
          ...(req.file && { imageUrl: req.file.filename }),
          ...(status && {
            deletedAt: status === 'published' ? null : new Date(),
          }),
          ...(category && { category: { connect: { id: +category } } }),
        },
      })

      res.json({ success: true })
    } catch (err) {
      const errors = 'errors' in err ? err.mapped() : { unknown: err }
      res.status(400).json({
        success: false,
        errors,
      })
    }
  },
}
