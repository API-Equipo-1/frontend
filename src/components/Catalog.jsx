import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useCart } from "../context/CartContext";
import { productService } from "../services/productService";
import "../styles/Catalog.css";
import "../styles/Cart.css";
import { ProductCard } from "./ProductCard";
import Cart from "./Cart";

export const Catalog = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const { setProductosOriginalesFromAPI, carrito } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    console.log("Fetching products...");
    setLoading(true);

    productService
      .getAllProducts()
      .then((data) => {
        console.log("Products loaded:", data);
        setProducts(data.sort((a, b) => a.name.localeCompare(b.name)));
        // Set original products for cart stock validation
        setProductosOriginalesFromAPI(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
        setError(error.message);
        setLoading(false);
      });
  }, [setProductosOriginalesFromAPI]);

  return (
    <div>
      <div className="catalog-content" style={{ display: 'flex', gap: '2rem' }}>
        <div className="product-list" style={{ flex: 1 }}>
          {loading && <p>Cargando productos...</p>}
          {error && <p style={{ color: "red" }}>Error: {error}</p>}
          {!loading && !error && products.length === 0 && (
            <p>No se encontraron productos.</p>
          )}
          {!loading &&
            !error &&
            products.length > 0 &&
            products.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
        </div>
        {carrito.length > 0 && (
          <div style={{ width: "350px", flexShrink: 0 }}>
            <Cart />
          </div>
        )}
      </div>
    </div>
  );
};
