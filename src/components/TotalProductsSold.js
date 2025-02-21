
import React, { useEffect, useState } from 'react';

const TotalProductsSold = () => {
  const [totalSold, setTotalSold] = useState(0);

  useEffect(() => {
    fetch('/api/products/total-sold')
      .then(response => response.json())
      .then(data => setTotalSold(data.totalSold));
  }, []);

  return (
    <div className="panel">
      <h3>Total de Productos Vendidos</h3>
      <p>{totalSold}</p>
    </div>
  );
};

export default TotalProductsSold;