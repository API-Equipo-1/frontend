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
import { Navbar } from "../components/Navbar.jsx";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Ruta principal redirige al catálogo */}
      <Route path="/" element={<Navigate to="/catalog" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      {/* Rutas públicas - accesibles sin autenticación */}
      <Route 
        path="/catalog" 
        element={
          <>
            <Navbar/>
            <Catalog />
          </>
        } 
      />
      <Route 
        path="/product/:id" 
        element={
          <>
            <Navbar/>
            <Product />
          </>
        } 
      />
      <Route 
        path="/cart" 
        element={
          <>
            <Navbar/>
            <CartPage />
          </>
        } 
      />
      
      {/* Ruta de checkout - accesible sin autenticación, pero validación interna para confirmar pedido */}
      <Route 
        path="/checkout" 
        element={
          <>
            <Navbar/>
            <Checkout />
          </>
        } 
      />
      
      {/* Rutas de gestión de productos - requieren autenticación */}
      <Route 
        path="/product-management" 
        element={
          <ProtectedRoute>
            <>
              <Navbar/>
              <ProductTable />
            </>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/product-form" 
        element={
          <ProtectedRoute>
            <>
              <Navbar/>
              <ProductForm />
            </>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/product-stats/:productId" 
        element={
          <ProtectedRoute>
            <>
              <Navbar/>
              <ProductStats />
            </>
          </ProtectedRoute>
        } 
      />
          
      {/* Ruta catch-all - redirige al catálogo si no se encuentra la página */}
      <Route path="*" element={<Navigate to="/catalog" replace />} />
    </Routes>
  );
};

export default AppRoutes;