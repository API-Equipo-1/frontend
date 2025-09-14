import { Routes, Route, Navigate } from "react-router-dom";
import { Catalog } from "../components/Catalog";
import { Product } from "../components/Product";
import Login from "../components/Login";
import Register from "../components/Register";
import ProtectedRoute from "../components/ProtectedRoute";
import CartPage from "../components/CartPage";
import Checkout from "../components/Checkout";
import { ProductTable } from "../components/management/ProductTable.jsx";
import { ProductForm } from "../components/management/ProductForm.jsx";
import { ProductStats } from "../components/management/ProductStats.jsx";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      <Route 
        path="/catalog" 
        element={
          <ProtectedRoute>
            <Catalog />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/product/:id" 
        element={
          <ProtectedRoute>
            <Product />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/cart" 
        element={
          <ProtectedRoute>
            <CartPage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/checkout" 
        element={
          <ProtectedRoute>
            <Checkout />
          </ProtectedRoute>
        } 
      />
      <Route path="/product-management" element={<ProductTable />} />
      <Route path="/product-form" element={<ProductForm />} />
      <Route path="/product-stats/:productId" element={<ProductStats />} />
          
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

export default AppRoutes;