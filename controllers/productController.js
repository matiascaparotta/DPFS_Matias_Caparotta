const showCreateForm = (req, res) => {
    res.render('products/create', { title: 'Crear Producto' });
  };
  
  const createProduct = (req, res) => {
    const { name, description, price, category } = req.body;
    console.log('Producto creado:', { name, description, price, category });
    res.redirect('/products'); 
  };
  
  const showEditForm = (req, res) => {
    const product = {
      id: req.params.id,
      name: 'Producto ',
      description: 'Descripción',
      price: 5000,
      category: 'Muebles',
    };
    res.render('products/edit', { title: 'Editar Producto', product });
  };
  
  const editProduct = (req, res) => {
    const { name, description, price, category } = req.body;
    console.log('Producto actualizado:', { id: req.params.id, name, description, price, category });
    res.redirect('/products'); 
  };
  
  
  const showProductDetail = (req, res) => {
    const productId = req.params.id;
  
   
    const product = {
      id: productId,
      name: 'Producto de Ejemplo',
      description: 'Este es un producto.',
      price: 2000,
      image: '/images/product1.jpg',
      category: 'Muebles',
    };
  
    if (product) {
      res.render('products/productDetail', { title: product.name, product });
    } else {
      res.status(404).send('Producto no encontrado');
    }
  };
  
  
  module.exports = {
    showCreateForm,
    createProduct,
    showEditForm,
    editProduct,
    showProductDetail, 
  };