'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // 1. Categories
    await queryInterface.bulkInsert('Categories', [
      { name: 'All Time Favourites', image: '/images/categories/burgers.png', order: 1, createdAt: new Date(), updatedAt: new Date() },
      { name: 'Burgers', image: '/images/categories/burgers.png', order: 2, createdAt: new Date(), updatedAt: new Date() },
      { name: 'Chicken & Sides', image: '/images/categories/burgers.png', order: 3, createdAt: new Date(), updatedAt: new Date() },
      { name: 'Drinks', image: '/images/categories/drinks.png', order: 4, createdAt: new Date(), updatedAt: new Date() },
      { name: 'Desserts', image: '/images/categories/desserts.png', order: 5, createdAt: new Date(), updatedAt: new Date() }
    ], {});

    const categories = await queryInterface.sequelize.query(`SELECT id, name FROM "Categories";`);
    const catMap = {};
    categories[0].forEach(c => catMap[c.name] = c.id);

    // 2. Unique Products (no duplicates)
    await queryInterface.bulkInsert('Products', [
      { name: 'Big Mac', description: 'Two 100% pure beef patties with special sauce, lettuce, cheese, pickles and onions on a sesame seed bun', price: 65000, image_url: '/images/products/bigmac.png', category_id: catMap['Burgers'], availability: true, createdAt: new Date(), updatedAt: new Date() },
      { name: 'McChicken', description: 'Crispy chicken patty with creamy mayo and fresh shredded lettuce', price: 42000, image_url: '/images/products/mcchicken.png', category_id: catMap['Burgers'], availability: true, createdAt: new Date(), updatedAt: new Date() },
      { name: 'Cheeseburger', description: '100% pure beef patty seasoned with a pinch of salt and pepper, topped with melty cheese', price: 35000, image_url: '/images/products/cheeseburger.png', category_id: catMap['Burgers'], availability: true, createdAt: new Date(), updatedAt: new Date() },
      { name: 'French Fries (L)', description: 'Large golden crispy fries, perfectly salted', price: 28000, image_url: '/images/products/french_fries.png', category_id: catMap['Chicken & Sides'], availability: true, createdAt: new Date(), updatedAt: new Date() },
      { name: 'Chicken McNuggets 6pc', description: '6 pieces of tender, juicy Chicken McNuggets', price: 38000, image_url: '/images/products/chicken_nuggets.png', category_id: catMap['Chicken & Sides'], availability: true, createdAt: new Date(), updatedAt: new Date() },
      { name: 'Coca-Cola (M)', description: 'Refreshing Coca-Cola, medium size', price: 15000, image_url: '/images/products/coca_cola.png', category_id: catMap['Drinks'], availability: true, createdAt: new Date(), updatedAt: new Date() },
      { name: 'Coca-Cola (L)', description: 'Refreshing Coca-Cola, large size', price: 20000, image_url: '/images/products/coca_cola.png', category_id: catMap['Drinks'], availability: true, createdAt: new Date(), updatedAt: new Date() },
      { name: 'McFlurry Oreo', description: 'Creamy vanilla soft serve with Oreo cookie pieces', price: 22000, image_url: '/images/products/mcflurry.png', category_id: catMap['Desserts'], availability: true, createdAt: new Date(), updatedAt: new Date() },
      { name: 'Sundae Cone', description: 'Classic vanilla soft serve in a crispy cone', price: 10000, image_url: '/images/products/sundae_cone.png', category_id: catMap['Desserts'], availability: true, createdAt: new Date(), updatedAt: new Date() },
    ], {});

    // 3. Link products to categories (many-to-many)
    const products = await queryInterface.sequelize.query(`SELECT id, name FROM "Products";`);
    const prodMap = {};
    products[0].forEach(p => prodMap[p.name] = p.id);

    const links = [
      // All Time Favourites gets Big Mac, McChicken, Cheeseburger, French Fries
      { product_id: prodMap['Big Mac'], category_id: catMap['All Time Favourites'] },
      { product_id: prodMap['McChicken'], category_id: catMap['All Time Favourites'] },
      { product_id: prodMap['Cheeseburger'], category_id: catMap['All Time Favourites'] },
      { product_id: prodMap['French Fries (L)'], category_id: catMap['All Time Favourites'] },
      // Burgers
      { product_id: prodMap['Big Mac'], category_id: catMap['Burgers'] },
      { product_id: prodMap['McChicken'], category_id: catMap['Burgers'] },
      { product_id: prodMap['Cheeseburger'], category_id: catMap['Burgers'] },
      // Chicken & Sides
      { product_id: prodMap['Chicken McNuggets 6pc'], category_id: catMap['Chicken & Sides'] },
      { product_id: prodMap['French Fries (L)'], category_id: catMap['Chicken & Sides'] },
      // Drinks
      { product_id: prodMap['Coca-Cola (M)'], category_id: catMap['Drinks'] },
      { product_id: prodMap['Coca-Cola (L)'], category_id: catMap['Drinks'] },
      // Desserts
      { product_id: prodMap['McFlurry Oreo'], category_id: catMap['Desserts'] },
      { product_id: prodMap['Sundae Cone'], category_id: catMap['Desserts'] },
    ];

    await queryInterface.bulkInsert('ProductCategories', links.map(l => ({ ...l, createdAt: new Date(), updatedAt: new Date() })), {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('ProductCategories', null, {});
    await queryInterface.bulkDelete('Products', null, {});
    await queryInterface.bulkDelete('Categories', null, {});
  }
};
