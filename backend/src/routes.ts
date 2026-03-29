import { Router, Request, Response } from 'express';
const db: any = require('../models');

const router = Router();

// CATEGORIES
router.get('/categories', async (req: Request, res: Response) => {
  try {
    const categories = await db.Category.findAll({ order: [['order', 'ASC']] });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

router.post('/categories', async (req: Request, res: Response) => {
  try {
    const category = await db.Category.create(req.body);
    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create category' });
  }
});

// PRODUCTS
// Get products, optionally filtered by category_id using the join table
router.get('/products', async (req: Request, res: Response) => {
  try {
    const { category_id } = req.query;
    if (category_id) {
      // Find products linked to this category via ProductCategories
      const links = await db.ProductCategory.findAll({
        where: { category_id: Number(category_id) },
        attributes: ['product_id']
      });
      const productIds = links.map((l: any) => l.product_id);
      const products = await db.Product.findAll({
        where: { id: productIds }
      });
      res.json(products);
    } else {
      const products = await db.Product.findAll();
      res.json(products);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// Get a single product with its categories
router.get('/products/:id', async (req: Request, res: Response) => {
  try {
    const product = await db.Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });

    const links = await db.ProductCategory.findAll({
      where: { product_id: product.id },
      attributes: ['category_id']
    });
    const categoryIds = links.map((l: any) => l.category_id);

    res.json({ ...product.toJSON(), category_ids: categoryIds });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});

// Get all products with their category_ids for admin
router.get('/products-admin', async (req: Request, res: Response) => {
  try {
    const products = await db.Product.findAll();
    const allLinks = await db.ProductCategory.findAll();

    const productsWithCategories = products.map((p: any) => {
      const pJson = p.toJSON();
      pJson.category_ids = allLinks
        .filter((l: any) => l.product_id === p.id)
        .map((l: any) => l.category_id);
      return pJson;
    });

    res.json(productsWithCategories);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

router.post('/products', async (req: Request, res: Response) => {
  try {
    const { category_ids, ...productData } = req.body;
    // Set the first category_id as default for backward compat
    if (category_ids && category_ids.length > 0) {
      productData.category_id = category_ids[0];
    }
    const product = await db.Product.create(productData);

    // Create join table entries
    if (category_ids && category_ids.length > 0) {
      const links = category_ids.map((catId: number) => ({
        product_id: product.id,
        category_id: catId,
        createdAt: new Date(),
        updatedAt: new Date()
      }));
      await db.ProductCategory.bulkCreate(links);
    }

    res.status(201).json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create product' });
  }
});

router.put('/products/:id', async (req: Request, res: Response) => {
  try {
    const { category_ids, ...productData } = req.body;
    if (category_ids && category_ids.length > 0) {
      productData.category_id = category_ids[0];
    }
    await db.Product.update(productData, { where: { id: req.params.id } });

    // Update join table
    if (category_ids) {
      await db.ProductCategory.destroy({ where: { product_id: req.params.id } });
      const links = category_ids.map((catId: number) => ({
        product_id: Number(req.params.id),
        category_id: catId,
        createdAt: new Date(),
        updatedAt: new Date()
      }));
      await db.ProductCategory.bulkCreate(links);
    }

    const product = await db.Product.findByPk(req.params.id);
    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update product' });
  }
});

router.delete('/products/:id', async (req: Request, res: Response) => {
  try {
    await db.ProductCategory.destroy({ where: { product_id: req.params.id } });
    await db.Product.destroy({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

// ORDERS
router.get('/orders', async (req: Request, res: Response) => {
  try {
    const orders = await db.Order.findAll({ order: [['createdAt', 'DESC']] });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

router.post('/orders', async (req: Request, res: Response) => {
  try {
    const { total_amount, status, items } = req.body;
    const order = await db.Order.create({ total_amount, status: status || 'completed' });

    if (items && items.length > 0) {
      const orderItems = items.map((item: any) => ({
        order_id: order.id,
        product_id: item.product_id,
        quantity: item.quantity,
        subtotal: item.subtotal
      }));
      await db.OrderItem.bulkCreate(orderItems);
    }

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create order' });
  }
});

// DASHBOARD
router.get('/dashboard', async (req: Request, res: Response) => {
  try {
    const totalOrders = await db.Order.count();
    const totalIncomeResult = await db.Order.sum('total_amount');

    // Most ordered items - include product name and image
    const mostOrdered = await db.OrderItem.findAll({
      attributes: [
        'product_id',
        [db.sequelize.fn('sum', db.sequelize.col('OrderItem.quantity')), 'totalQuantity']
      ],
      include: [{
        model: db.Product,
        as: 'Product',
        attributes: ['name', 'image_url', 'price']
      }],
      group: ['product_id', 'Product.id', 'Product.name', 'Product.image_url', 'Product.price'],
      order: [[db.sequelize.fn('sum', db.sequelize.col('OrderItem.quantity')), 'DESC']],
      limit: 10,
      raw: true,
      nest: true
    });

    // Daily income for the last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const dailyIncome = await db.Order.findAll({
      attributes: [
        [db.sequelize.fn('date', db.sequelize.col('createdAt')), 'date'],
        [db.sequelize.fn('sum', db.sequelize.col('total_amount')), 'income'],
        [db.sequelize.fn('count', db.sequelize.col('id')), 'orders']
      ],
      where: {
        createdAt: {
          [db.Sequelize.Op.gte]: sevenDaysAgo
        }
      },
      group: [db.sequelize.fn('date', db.sequelize.col('createdAt'))],
      order: [[db.sequelize.fn('date', db.sequelize.col('createdAt')), 'ASC']],
      raw: true
    });

    res.json({
      totalOrders,
      totalIncome: totalIncomeResult || 0,
      mostOrdered,
      dailyIncome
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch dashboard data' });
  }
});

export default router;
