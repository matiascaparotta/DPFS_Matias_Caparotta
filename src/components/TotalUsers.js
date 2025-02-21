
import React, { useEffect, useState } from 'react';

const TotalUsers = () => {
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetch('/api/users')
      .then(response => response.json())
      .then(data => setTotal(data.count));
  }, []);

  return (
    <div className="panel">
      <h3>Total de Usuarios</h3>
      <p>{total}</p>
    </div>
  );
};

export default TotalUsers;