import React, { useEffect, useState } from 'react';

const LatestProduct = () => {
  const [product, setProduct] = useState(null);

  useEffect(() => {
    fetch('/api/products?limit=1&offset=0')
      .then(response => response.json())
      .then(data => {
        console.log('Datos recibidos:', data); 
        if (data.products && data.products.length > 0) {
          setProduct(data.products[0]);
        }
      })
      .catch(error => {
        console.error('Error al obtener el último producto:', error);
      });
  }, []);

  return (
    <div className="panel">
      <h3>Último Producto Creado</h3>
      {product ? (
        <div>
          <p>{product.name}</p>
          <p>{product.description}</p>
        </div>
      ) : (
        <p>Cargando...</p>
      )}
    </div>
  );
};

export default LatestProduct;