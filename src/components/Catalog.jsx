import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { productService } from "../services/productService";
import "../styles/Catalog.css";
import { ProductCard } from "./ProductCard";

export const Catalog = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  useEffect(() => {
    console.log("Fetching products...");
    setLoading(true);
    
    productService.getAllProducts()
      .then((data) => {
        console.log("Products loaded:", data);
        setProducts(data.sort((a, b) => a.name.localeCompare(b.name)));
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
        setError(error.message);
        setLoading(false);
      });
  }, []);

  return (
    <div>
      {/* Header with user info and logout */}
      <header style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '1rem 2rem',
        backgroundColor: '#f8f9fa',
        borderBottom: '1px solid #e5e7eb',
        marginBottom: '2rem'
      }}>
        <div>
          <h1 style={{ margin: 0 }}>Cátalogo de productos</h1>
          {user && (
            <button 
              onClick={() => navigate('/product-management')}
              style={{
                marginLeft: '1rem',
                padding: '0.5rem 1rem',
                backgroundColor: '#4CAF50',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Gestionar Mis Productos
            </button>
          )}
          {user && (
            <p style={{ 
              margin: '0.5rem 0 0 0', 
              color: '#6b7280', 
              fontSize: '0.875rem' 
            }}>
              Bienvenido/a, {user.firstName} {user.lastName}
            </p>
          )}
        </div>
        <button
          onClick={handleLogout}
          style={{
            backgroundColor: '#374151',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            padding: '0.5rem 1rem',
            cursor: 'pointer',
            fontSize: '0.875rem'
          }}
        >
          Cerrar Sesión
        </button>
      </header>

      <div className="product-list">
        {loading && <p>Cargando productos...</p>}
        {error && <p style={{color: 'red'}}>Error: {error}</p>}
        {!loading && !error && products.length === 0 && (
          <p>No se encontraron productos.</p>
        )}
        {!loading && !error && products.length > 0 && products.map((product) => (
          <ProductCard key={product.id} {...product} />
        ))}
      </div>
    </div>
  );
};
