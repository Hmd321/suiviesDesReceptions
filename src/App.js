import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './Pages/HomePage';
import ProductPage from './Pages/ProductPage';
import NotFoundPage from './Pages/NotFoundPage';
import './styles.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import EditProductPage from './Pages/EditProductPage';
import ReceptionDetail from './Pages/ReceptionDetail';
import EditReception from './Pages/EditReception';


const App = () => {
    return (
      <Router>
      <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/product/:id" element={<ProductPage />} />
          <Route path="/edit-product/:id" element={<EditProductPage />} /> {/* Add the route for edit */}
          <Route path="/reception/:id" element={<ReceptionDetail />} />
          <Route path="/edit-reception/:id" element={EditReception} />
          <Route path="*" element={<NotFoundPage />} />
      </Routes>
  </Router>
    );
};

export default App;
