
import React, { useEffect, useState } from 'react';

const TotalProducts = () => {
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetch('/api/products')
      .then(response => response.json())
      .then(data => setTotal(data.count));
  }, []);

  return (
    <div className="panel">
      <h3>Total de Productos</h3>
      <p>{total}</p>
    </div>
  );
};

export default TotalProducts;