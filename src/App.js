
import React from 'react';
import TotalProducts from './components/TotalProducts';
import TotalUsers from './components/TotalUsers';
import TotalCategories from './components/TotalCategories';
import LatestProduct from './components/LatestProduct';
import CategoryProducts from './components/CategoryProducts';
import ProductList from './components/ProductList';
import './App.css';

const App = () => {
  return (
    <div className="dashboard">
      <TotalProducts />
      <TotalUsers />
      <TotalCategories />
      <LatestProduct />
      <CategoryProducts />
      <ProductList />
    </div>
  );
};

export default App;