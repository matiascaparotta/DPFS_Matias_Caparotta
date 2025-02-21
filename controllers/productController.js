const { Product, Category } = require('../models');
const { Op } = require('sequelize');
const path = require('path');
const fs = require('fs');
const sharp = require('sharp'); 
const { validationResult } = require('express-validator');

const productController = {
  // Método para listar productos en formato JSON con paginación
  async listProductsApi(req, res) {
    try {
      const limit = parseInt(req.query.limit) || 10; // Número de resultados por página
      const offset = parseInt(req.query.offset) || 0; // Desplazamiento

      const { count, rows: products } = await Product.findAndCountAll({
        include: { model: Category, as: 'category', attributes: ['categoryId', 'name_category'] },
        limit,
        offset
      });

      const countByCategory = products.reduce((acc, product) => {
        acc[product.category.name_category] = (acc[product.category.name_category] || 0) + 1;
        return acc;
      }, {});

      const nextOffset = offset + limit;
      const previousOffset = offset - limit < 0 ? 0 : offset - limit;

      res.json({
        count,
        countByCategory,
        products: products.map(product => ({
          id: product.productId,
          name: product.product_name,
          description: product.description,
          categories: product.category.name_category,
          detail: `/api/products/${product.productId}`
        })),
        next: nextOffset < count ? `/api/products?limit=${limit}&offset=${nextOffset}` : null,
        previous: offset > 0 ? `/api/products?limit=${limit}&offset=${previousOffset}` : null
      });
    } catch (error) {
      console.error('Error al listar productos:', error.message);
      res.status(500).json({ error: 'Error interno del servidor al listar productos.' });
    }
  },

  // Método para obtener el detalle de un producto en formato JSON
  async getProductDetailApi(req, res) {
    try {
      const product = await Product.findByPk(req.params.id, {
        include: {
          model: Category,
          as: 'category',
          attributes: ['categoryId', 'name_category'],
        },
      });
      if (!product) {
        return res.status(404).json({ error: 'Producto no encontrado.' });
      }
      res.json({
        id: product.productId,
        name: product.product_name,
        description: product.description,
        categories: product.category.name_category,
        image: product.product_image
      });
    } catch (error) {
      console.error('Error al buscar detalle de producto:', error.message);
      res.status(500).json({ error: 'Error interno del servidor.' });
    }
  },

  // Método para listar productos y renderizar la vista
  async listProducts(req, res) {
    try {
      const products = await Product.findAll({
        include: { model: Category, as: 'category', attributes: ['categoryId', 'name_category'] }
      });
      res.render('products/list', { title: 'Listado de Productos', products });
    } catch (error) {
      console.error('Error al listar productos:', error.message);
      res.status(500).send('Error interno del servidor al listar productos.');
    }
  },

  // Método para obtener el detalle de un producto y renderizar la vista
  async getProductDetail(req, res) {
    try {
      const product = await Product.findByPk(req.params.productId, {
        include: {
          model: Category,
          as: 'category',
          attributes: ['categoryId', 'name_category'],
        },
      });
      if (!product) {
        return res.status(404).send('Producto no encontrado.');
      }
      res.render('products/detail', { title: 'Detalle de Producto', product });
    } catch (error) {
      console.error('Error al buscar detalle de producto:', error.message);
      res.status(500).send('Error interno del servidor.');
    }
  },

  async listByCategory(req, res) {
    try {
      const { categoryId } = req.params;
      const products = await Product.findAll({
        where: { category_id: categoryId },
        include: {
          model: Category,
          as: 'category',
          attributes: ['categoryId', 'name_category'],
        },
      });
      const categories = await Category.findAll();
      res.render('products/list', {
        title: 'Productos por Categoría',
        products,
        categories,
        selectedCategory: categoryId,
      });
    } catch (error) {
      console.error('Error al filtrar productos por categoría:', error.message);
      res.status(500).send('Error interno del servidor.');
    }
  },

  async showCreateForm(req, res) {
    try {
      console.log("Obteniendo categorías...");
      let categories = await Category.findAll();
      categories = categories.map(category => category.dataValues);
  
      console.log("Categorías obtenidas:", categories);
  
      res.render("products/create", { 
        title: "Crear Producto", 
        categories, 
        errors: {}  
      });
    } catch (error) {
      console.error("❌ Error al cargar el formulario de creación:", error.stack); 
      res.status(500).send("Error interno del servidor al cargar el formulario.");
    }
  },

  async createProduct(req, res) {
    const errors = validationResult(req).mapped();

    if (req.fileValidationError) {
        errors.product_image = { msg: req.fileValidationError };
    }

    if (Object.keys(errors).length > 0) {
        console.log("Errores de validación:", errors);

        const categories = await Category.findAll();
        return res.status(400).render("products/create", {
            title: "Crear Producto",
            errors,
            categories,
            product_name: req.body.product_name || "",
            description: req.body.description || "",
            price: req.body.price || "",
            category_id: req.body.category_id || "",
        });
    }

    try {
        const { product_name, description, price, category_id, external_image } = req.body;
        let productImage = "default.png";

        if (req.file) {
            const uploadPath = path.join(__dirname, '../public/images/products');
            const filePath = path.join(uploadPath, req.file.filename);
            const resizedPath = path.join(uploadPath, `resized-${req.file.filename}`);

            await sharp(filePath).resize(500, 500).toFile(resizedPath);
            fs.unlinkSync(filePath);
            productImage = `resized-${req.file.filename}`;
        } else if (external_image) {
            productImage = external_image;
        }

        await Product.create({
            product_name,
            description,
            price: parseFloat(price),
            category_id,
            product_image: productImage,
        });

        res.redirect("/products");
    } catch (error) {
        console.error("❌ Error al crear producto:", error.stack);
        res.status(500).send("Error interno del servidor al crear producto.");
    }
  },

  async showEditForm(req, res) {
    try {
      const product = await Product.findByPk(req.params.productId, {
        include: { model: Category, as: 'category', attributes: ['categoryId', 'name_category'] }
      });

      const categories = await Category.findAll();
      if (!product) return res.status(404).send('Producto no encontrado.');

      res.render('products/edit', {
        title: 'Editar Producto',
        product,
        categories,
        errors: {}  
      });
    } catch (error) {
      console.error('Error al buscar producto:', error.message);
      res.status(500).send('Error interno del servidor.');
    }
  },

  async editProduct(req, res) {
    try {
      const { product_name, description, price, category_id } = req.body;
      const product = await Product.findByPk(req.params.productId);

      if (!product) return res.status(404).send("Producto no encontrado.");
      let productImage = product.product_image;

      if (req.file) {
        const uploadPath = path.join(__dirname, '../public/images/products');
        const filePath = path.join(uploadPath, req.file.filename);
        const resizedPath = path.join(uploadPath, `resized-${req.file.filename}`);

        await sharp(filePath).resize(500, 500).toFile(resizedPath);
        fs.unlinkSync(filePath);
        productImage = `resized-${req.file.filename}`;

        if (product.product_image !== 'default.png') {
          const oldImagePath = path.join(uploadPath, product.product_image);
          if (fs.existsSync(oldImagePath)) fs.unlinkSync(oldImagePath);
        }
      }

      await product.update({
        product_name,
        description,
        price: parseFloat(price),
        category_id: category_id ? parseInt(category_id, 10) : null,
        product_image: productImage,
      });

      res.redirect('/products');
    } catch (error) {
      console.error('Error al editar producto:', error.message);
      res.status(500).send('Error interno del servidor.');
    }
  },

  async showProductDetail(req, res) {
    try {
      const product = await Product.findByPk(req.params.productId, {
        include: {
          model: Category,
          as: 'category',
          attributes: ['categoryId', 'name_category'],
        },
      });
      if (!product) {
        return res.status(404).send('Producto no encontrado.');
      }
      res.render('products/productDetail', {
        title: product.product_name,
        product,
      });
    } catch (error) {
      console.error('Error al buscar detalle de producto:', error.message);
      res.status(500).send('Error interno del servidor.');
    }
  },

  async searchProducts(req, res) {
    try {
      const query = req.query.query;
      if (!query || query.trim() === '') {
        return res.render('products/searchResults', {
          title: 'Resultados de Búsqueda',
          products: [],
          errorMessage: 'Por favor, ingrese un término para buscar.',
        });
      }
      const products = await Product.findAll({
        where: {
          product_name: {
            [Op.like]: `%${query}%`,
          },
        },
        include: {
          model: Category,
          as: 'category',
          attributes: ['categoryId', 'name_category'],
        },
      });
      res.render('products/searchResults', {
        title: 'Resultados de Búsqueda',
        products,
        errorMessage: products.length ? null : 'No se encontraron productos que coincidan con la búsqueda.',
      });
    } catch (error) {
      console.error('Error al buscar productos:', error.message);
      res.status(500).send('Error interno del servidor.');
    }
  },

  async deleteProduct(req, res) {
    try {
      const product = await Product.findByPk(req.params.productId);
      if (!product) return res.status(404).send('Producto no encontrado.');

      if (product.product_image !== 'default.png') {
        const imagePath = path.join(__dirname, '../public/images/products', product.product_image);
        if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);
      }

      await product.destroy();
      res.redirect('/products');
    } catch (error) {
      console.error('Error al eliminar producto:', error.message);
      res.status(500).send('Error interno del servidor.');
    }
  },
};

module.exports = productController;