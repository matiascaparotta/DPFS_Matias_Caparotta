const { Product, Category } = require('../models');
const { Op } = require('sequelize');
const path = require('path');
const fs = require('fs');
const sharp = require('sharp'); 

const productController = {
  // Listar todos los productos
  async listProducts(req, res) {
    try {
      const products = await Product.findAll({
        include: {
          model: Category,
          as: 'category', 
          attributes: ['categoryId', 'name_category'], 
        },
      });
      res.render('products/list', { title: 'Listado de Productos', products });
    } catch (error) {
      console.error('Error al listar productos:', error.message);
      res.status(500).send('Error interno del servidor al listar productos.');
    }
  },

  // Listar productos por categoría
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

  // Mostrar el formulario para crear un producto
  async showCreateForm(req, res) {
    try {
      const categories = await Category.findAll(); 
      res.render('products/create', { title: 'Crear Producto', categories });
    } catch (error) {
      console.error('Error al cargar categorías:', error.message);
      res.status(500).send('Error interno del servidor al cargar el formulario.');
    }
  },

  // Crear un producto
  async createProduct(req, res) {
    try {
      const { product_name, description, price, category_id, external_image } = req.body;

      
      if (!product_name || !description || isNaN(price) || !category_id) {
        return res.status(400).render("products/create", {
          title: "Crear Producto",
          errorMessage: "Todos los campos son obligatorios.",
        });
      }

      
      let productImage = "default.png";
      if (req.file) {
        const uploadPath = path.join(__dirname, '../public/images/products');
        const filePath = path.join(uploadPath, req.file.filename);
        const resizedPath = path.join(uploadPath, `resized-${req.file.filename}`);

       
        await sharp(filePath)
          .resize(500, 500) 
          .toFile(resizedPath);

        
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
      console.error("Error al crear producto:", error.message);
      res.status(500).send("Error interno del servidor al crear producto.");
    }
  },

  // Mostrar el formulario para editar un producto
  async showEditForm(req, res) {
    try {
      const product = await Product.findByPk(req.params.productId, {
        include: {
          model: Category,
          as: 'category',
          attributes: ['categoryId', 'name_category'],
        },
      });

      const categories = await Category.findAll();

      if (!product) {
        return res.status(404).send('Producto no encontrado.');
      }

      res.render('products/edit', {
        title: 'Editar Producto',
        product,
        categories,
      });
    } catch (error) {
      console.error('Error al buscar producto:', error.message);
      res.status(500).send('Error interno del servidor.');
    }
  },

  // Editar un producto
  async editProduct(req, res) {
    try {
      const { product_name, description, price, category_id } = req.body;

      const product = await Product.findByPk(req.params.productId);
      if (product) {
       
        let productImage = product.product_image;

        if (req.file) {
          const uploadPath = path.join(__dirname, '../public/images/products');
          const filePath = path.join(uploadPath, req.file.filename);
          const resizedPath = path.join(uploadPath, `resized-${req.file.filename}`);

         
          await sharp(filePath)
            .resize(500, 500) 
            .toFile(resizedPath);

          
          fs.unlinkSync(filePath);
          productImage = `resized-${req.file.filename}`;

          
          if (product.product_image !== 'default.png') {
            const oldImagePath = path.join(uploadPath, product.product_image);
            if (fs.existsSync(oldImagePath)) {
              fs.unlinkSync(oldImagePath);
            }
          }
        }

        
        await product.update({
          product_name,
          description,
          price: parseFloat(price),
          category_id,
          product_image: productImage,
        });

        res.redirect('/products');
      } else {
        res.status(404).send('Producto no encontrado.');
      }
    } catch (error) {
      console.error('Error al editar producto:', error.message);
      res.status(500).send('Error interno del servidor.');
    }
  },

  // Mostrar el detalle de un producto
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

  // Buscar productos por nombre o descripción
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

  // Eliminar un producto
  async deleteProduct(req, res) {
    try {
      const product = await Product.findByPk(req.params.productId);

      if (!product) {
        return res.status(404).send('Producto no encontrado.');
      }

      
      if (product.product_image !== 'default.png') {
        const imagePath = path.join(__dirname, '../public/images/products', product.product_image);
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
      }

      
      await product.destroy();

      console.log(`Producto con ID ${req.params.productId} eliminado.`);
      res.redirect('/products');
    } catch (error) {
      console.error('Error al eliminar producto:', error.message);
      res.status(500).send('Error interno del servidor.');
    }
  },
};


module.exports = productController;