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
  const [allProducts, setAllProducts] = useState([]); // Guardamos todos los productos
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [categories, setCategories] = useState([]);
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
        const sortedData = data.sort((a, b) => a.name.localeCompare(b.name));
        setAllProducts(sortedData); // Guardamos todos los productos
        setProducts(sortedData);
        
        // Extraer categorías únicas
        const uniqueCategories = [...new Set(data.map(product => product.category))];
        setCategories(uniqueCategories.sort());
        
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

  // Efecto para filtrar productos cuando cambia el término de búsqueda o la categoría
  useEffect(() => {
    let filteredProducts = [...allProducts];

    // Filtrar por categoría
    if (selectedCategory) {
      filteredProducts = filteredProducts.filter(
        product => product.category === selectedCategory
      );
    }

    // Filtrar por término de búsqueda
    if (searchTerm.trim()) {
      filteredProducts = filteredProducts.filter(
        product =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setProducts(filteredProducts);
  }, [searchTerm, selectedCategory, allProducts]);

  // Función para limpiar filtros
  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("");
  };

  return (
    <div>
      {/* Controles de búsqueda y filtrado */}
      <div className="catalog-filters">
        <div className="search-container">
          <input
            type="text"
            placeholder="Buscar productos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        
        <div className="filter-container">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="category-select"
          >
            <option value="">Todas las categorías</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        {(searchTerm || selectedCategory) && (
          <button onClick={clearFilters} className="clear-filters-btn">
            Limpiar filtros
          </button>
        )}
      </div>

      {/* Resultados de búsqueda */}
      {(searchTerm || selectedCategory) && (
        <div className="search-results-info">
          <p>
            {products.length} producto{products.length !== 1 ? 's' : ''} encontrado{products.length !== 1 ? 's' : ''}
            {searchTerm && ` para "${searchTerm}"`}
            {selectedCategory && ` en "${selectedCategory}"`}
          </p>
        </div>
      )}

      <div className="catalog-content" style={{ display: 'flex', gap: '2rem' }}>
        <div className="product-list" style={{ flex: 1 }}>
          {loading && <p>Cargando productos...</p>}
          {error && <p style={{ color: "red" }}>Error: {error}</p>}
          {!loading && !error && products.length === 0 && !searchTerm && !selectedCategory && (
            <p>No se encontraron productos.</p>
          )}
          {!loading && !error && products.length === 0 && (searchTerm || selectedCategory) && (
            <p>No se encontraron productos que coincidan con los filtros aplicados.</p>
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
