const fs = require("fs");
const path = require("path");

// Ruta al archivo JSON de productos
const productsFilePath = path.join(__dirname, "../data/products.json");

// Leer productos del archivo JSON
const getProducts = () => {
  try {
    const data = fs.readFileSync(productsFilePath, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error al leer el archivo JSON:", error);
    return [];
  }
};

// Guardar productos en el archivo JSON
const saveProducts = (products) => {
  try {
    fs.writeFileSync(productsFilePath, JSON.stringify(products, null, 2));
  } catch (error) {
    console.error("Error al guardar el archivo JSON:", error);
  }
};

// Listar productos
const listProducts = (req, res) => {
  const products = getProducts();
  res.render("products/list", { title: "Listado de Productos", products });
};

// Mostrar formulario para crear un producto
const showCreateForm = (req, res) => {
  res.render("products/create", { title: "Crear Producto" });
};

// Crear un producto
const createProduct = (req, res) => {
  const products = getProducts();
  const { name, description, price, category } = req.body;

  // Validar campos
  if (!name || !description || isNaN(price) || !category) {
    return res.status(400).render("products/create", {
      title: "Crear Producto",
      errorMessage: "Todos los campos son obligatorios.",
    });
  }

  // Crear nuevo producto
  const newProduct = {
    id: products.length > 0 ? products[products.length - 1].id + 1 : 1,
    name,
    description,
    price: parseFloat(price),
    category,
    image: "/images/default.jpg", // Imagen predeterminada
  };

  products.unshift(newProduct); // Agregar al inicio de la lista
  saveProducts(products);

  console.log("Producto creado:", newProduct);
  res.redirect("/products");
};

// Mostrar formulario para editar un producto
const showEditForm = (req, res) => {
  const products = getProducts();
  const product = products.find((p) => p.id === parseInt(req.params.id));

  if (product) {
    res.render("products/edit", { title: "Editar Producto", product });
  } else {
    res.status(404).send("Producto no encontrado");
  }
};

// Editar un producto
const editProduct = (req, res) => {
  const products = getProducts();
  const { name, description, price, category } = req.body;
  const productId = parseInt(req.params.id);

  const productIndex = products.findIndex((p) => p.id === productId);

  if (productIndex !== -1) {
    products[productIndex] = {
      ...products[productIndex],
      name,
      description,
      price: parseFloat(price),
      category,
    };

    saveProducts(products);
    console.log("Producto actualizado:", products[productIndex]);

    // Renovar sesión para mantenerla activa
    req.session.touch();

    res.redirect("/products");
  } else {
    res.status(404).send("Producto no encontrado");
  }
};

// Mostrar detalle de un producto
const showProductDetail = (req, res) => {
  const products = getProducts();
  const product = products.find((p) => p.id === parseInt(req.params.id));

  if (product) {
    res.render("products/productDetail", { title: product.name, product });
  } else {
    res.status(404).send("Producto no encontrado");
  }
};

// Buscar productos
const searchProducts = (req, res) => {
  const query = req.query.query.toLowerCase();
  const products = getProducts();

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(query) ||
      product.description.toLowerCase().includes(query)
  );

  if (filteredProducts.length > 0) {
    res.render("products/searchResults", {
      title: "Resultados de Búsqueda",
      products: filteredProducts,
    });
  } else {
    res.render("products/searchResults", {
      title: "Resultados de Búsqueda",
      products: [],
      errorMessage: "Producto no encontrado.",
    });
  }
  req.session.touch()
};

// Eliminar un producto
const deleteProduct = (req, res) => {
  const products = getProducts();
  const productId = parseInt(req.params.id);

  const productIndex = products.findIndex((product) => product.id === productId);

  if (productIndex !== -1) {
    const updatedProducts = products.filter((product) => product.id !== productId);

    saveProducts(updatedProducts);
    console.log(`Producto con ID ${productId} eliminado.`);

    // Renovar sesión para mantenerla activa
    req.session.touch();

    res.redirect("/products");
  } else {
    res.status(404).send("Producto no encontrado");
  }
};


module.exports = {
  listProducts,
  showCreateForm,
  createProduct,
  showEditForm,
  editProduct,
  showProductDetail,
  searchProducts,
  deleteProduct,
};