
import React, { useEffect, useState } from 'react';

const CategoryProducts = () => {
  const [categories, setCategories] = useState({});

  useEffect(() => {
    fetch('/api/products')
      .then(response => response.json())
      .then(data => setCategories(data.countByCategory));
  }, []);

  return (
    <div className="panel">
      <h3>Total de Productos por Categoría</h3>
      <ul>
        {Object.entries(categories).map(([category, count]) => (
          <li key={category}>{category}: {count}</li>
        ))}
      </ul>
    </div>
  );
};

export default CategoryProducts;