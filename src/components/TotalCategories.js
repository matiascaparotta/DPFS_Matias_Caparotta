
import React, { useEffect, useState } from 'react';

const TotalCategories = () => {
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetch('/api/products')
      .then(response => response.json())
      .then(data => setTotal(Object.keys(data.countByCategory).length));
  }, []);

  return (
    <div className="panel">
      <h3>Total de Categorías</h3>
      <p>{total}</p>
    </div>
  );
};

export default TotalCategories;